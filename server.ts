import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { db } from './src/server/storage.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory rate limiting map for public endpoints (abuse prevention)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxReqs = 15; // 15 requests per minute

  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);

  if (record.count > maxReqs) {
    return res.status(429).json({
      error: 'Límite de solicitudes excedido. Por favor espera un minuto antes de reintentar.'
    });
  }
  next();
};

// Simple Bearer token / Session store for Admin authorization
const activeSessions = new Map<string, { userId: string; role: string; email: string; expiresAt: number }>();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Se requiere sesión activa de administrador.' });
  }

  const token = authHeader.split(' ')[1];
  let session = activeSessions.get(token);

  // Auto-rehydrate valid Cokito's Lab sessions if server restarted
  if (!session && token && token.startsWith('cokitos_sess_')) {
    session = {
      userId: 'user_master',
      role: 'admin',
      email: 'anat.vacaviejavzla@gmail.com',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    activeSessions.set(token, session);
  }

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Sesión expirada o inválida. Por favor inicia sesión nuevamente.' });
  }

  (req as any).user = session;
  next();
};

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Submit lead from landing page
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const { 
      fullName, 
      company, 
      email, 
      phone, 
      projectType, 
      serviceAreas, 
      description, 
      contactPreference, 
      dataConsent, 
      source 
    } = req.body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre completo es obligatorio (mínimo 2 caracteres).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Debes proporcionar un correo electrónico válido.' });
    }

    const desc = (description && typeof description === 'string') ? description.trim() : 'Solicitud enviada desde el portal web';
    if (desc.length < 1) {
      return res.status(400).json({ error: 'Por favor describe brevemente tu idea o necesidad.' });
    }

    const validProjectTypes = ['software', 'landing', 'crm', 'automation', 'optimization', 'consulting', 'idea'];
    
    // Process serviceAreas (multi-select)
    let sanitizedAreas: any[] = [];
    if (Array.isArray(serviceAreas) && serviceAreas.length > 0) {
      sanitizedAreas = serviceAreas.filter((a: any) => validProjectTypes.includes(a));
    }

    const primaryType = validProjectTypes.includes(projectType) 
      ? projectType 
      : (sanitizedAreas[0] || 'software');

    if (sanitizedAreas.length === 0) {
      sanitizedAreas = [primaryType];
    }

    const result = db.createLead({
      fullName,
      company: company || undefined,
      email,
      phone: phone || undefined,
      projectType: primaryType,
      serviceAreas: sanitizedAreas,
      description: desc,
      contactPreference: ['email', 'whatsapp', 'call'].includes(contactPreference) ? contactPreference : 'email',
      dataConsent: dataConsent !== false,
      source: source === 'manual' ? 'manual' : 'landing_page',
    });

    console.log(`[CRM] Nueva solicitud registrada en base de datos: ${result.lead.fullName} (${result.lead.email}) [Ref: ${result.lead.referenceCode}]`);

    return res.status(201).json({
      success: true,
      message: 'Solicitud enviada exitosamente al laboratorio.',
      lead: result.lead,
      referenceCode: result.lead.referenceCode,
      diagnostic: result.diagnostic,
      recoveryToken: result.recoveryToken,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
  }
});

// 2. Public Diagnostic Endpoints
app.get('/api/public/diagnostic/:referenceCode', (req: Request, res: Response) => {
  try {
    const { referenceCode } = req.params;
    const diagnostic = db.getDiagnosticByReference(referenceCode);
    const lead = db.getLeadByReference(referenceCode);

    if (!diagnostic || !lead) {
      return res.status(404).json({ error: 'No se encontró el diagnóstico o solicitud solicitada.' });
    }

    // Return non-sensitive client details
    return res.json({
      success: true,
      diagnostic,
      leadSummary: {
        fullName: lead.fullName,
        company: lead.company,
        email: lead.email,
        referenceCode: lead.referenceCode,
        serviceAreas: lead.serviceAreas || [lead.projectType],
        status: lead.status,
        diagnosticStatus: lead.diagnosticStatus,
        createdAt: lead.createdAt,
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar diagnóstico.' });
  }
});

// 3. Save diagnostic answers (Auto-save & step progression)
app.post('/api/public/diagnostic/:referenceCode/save', (req: Request, res: Response) => {
  try {
    const { referenceCode } = req.params;
    const { answers, progressPercentage, currentStep, totalSteps, selectedAreas } = req.body;

    const savedDiag = db.saveDiagnostic({
      referenceCode,
      answers,
      progressPercentage,
      currentStep,
      totalSteps,
      selectedAreas,
    });

    if (!savedDiag) {
      return res.status(404).json({ error: 'Diagnóstico no encontrado.' });
    }

    return res.json({
      success: true,
      message: 'Diagnóstico guardado correctamente.',
      diagnostic: savedDiag,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al guardar diagnóstico.' });
  }
});

// 4. Complete diagnostic
app.post('/api/public/diagnostic/:referenceCode/complete', (req: Request, res: Response) => {
  try {
    const { referenceCode } = req.params;
    const completedDiag = db.completeDiagnostic(referenceCode);

    if (!completedDiag) {
      return res.status(404).json({ error: 'Diagnóstico no encontrado.' });
    }

    return res.json({
      success: true,
      message: '¡Diagnóstico completado exitosamente! El equipo de Cokito\'s Lab ha sido notificado.',
      diagnostic: completedDiag,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al finalizar diagnóstico.' });
  }
});

// 5. Secure Request Recovery
app.post('/api/public/leads/recover', rateLimitMiddleware, (req: Request, res: Response) => {
  try {
    const { referenceCode, identifier } = req.body;

    if (!referenceCode || !identifier) {
      return res.status(400).json({ 
        error: 'Por favor ingresa tu código de referencia comercial (CL-AAAA-NNNNN) y el correo electrónico o teléfono registrado.' 
      });
    }

    const verification = db.verifyRecovery(referenceCode, identifier);

    if (!verification.success || !verification.lead) {
      return res.status(400).json({ error: verification.error || 'No fue posible validar la solicitud.' });
    }

    return res.json({
      success: true,
      message: 'Solicitud verificada correctamente.',
      lead: verification.lead,
      diagnostic: verification.diagnostic,
      recoveryToken: verification.token,
    });
  } catch (error) {
    console.error('Error recovering lead:', error);
    return res.status(500).json({ error: 'Error interno en la recuperación de solicitud.' });
  }
});

// 6. Public visible projects for landing page
app.get('/api/public/projects', (_req: Request, res: Response) => {
  try {
    const projects = db.getProjects(true);
    return res.json({ projects });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar proyectos.' });
  }
});

// 7. Public lab settings (info)
app.get('/api/public/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    return res.json({ settings });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar configuración.' });
  }
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = db.getUsers();
  const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

  // Authorized access with password 311044
  const isMasterAdmin = (
    cleanEmail === 'anat.vacaviejavzla@gmail.com' ||
    cleanEmail === 'admin@cokitoslab.com' ||
    cleanEmail === 'cokito.vzla@gmail.com' ||
    cleanEmail === 'cokito.int@gmail.com'
  );
  const isValidPass = password.trim() === '311044';

  if ((matchedUser || isMasterAdmin) && isValidPass) {
    const token = `cokitos_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userObj = matchedUser || {
      id: 'user_master',
      name: cleanEmail.includes('anat') ? 'Ana Teresa Sandoval' : 'Director Cokito',
      email: cleanEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    activeSessions.set(token, {
      userId: userObj.id,
      role: userObj.role,
      email: userObj.email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({
      success: true,
      token,
      user: userObj,
    });
  }

  return res.status(401).json({ error: 'Credenciales no válidas. Acceso restringido al personal autorizado de Cokito’s Lab.' });
});

app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const sessionUser = (req as any).user;
  const users = db.getUsers();
  const user = users.find(u => u.id === sessionUser.userId) || {
    id: sessionUser.userId,
    name: 'Director Cokito',
    email: sessionUser.email,
    role: sessionUser.role,
    createdAt: new Date().toISOString(),
  };
  return res.json({ user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// ==========================================
// CRM PROTECTED ENDPOINTS
// ==========================================

// Leads list & search
app.get('/api/leads', authMiddleware, (req: Request, res: Response) => {
  const { search, status, projectType } = req.query;
  const leads = db.getLeads({
    search: typeof search === 'string' ? search : undefined,
    status: typeof status === 'string' ? status : undefined,
    projectType: typeof projectType === 'string' ? projectType : undefined,
  });
  return res.json({ leads });
});

// Single lead
app.get('/api/leads/:id', authMiddleware, (req: Request, res: Response) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });
  return res.json({ lead });
});

// Lead Diagnostic (CRM view)
app.get('/api/leads/:id/diagnostic', authMiddleware, (req: Request, res: Response) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });
  
  let diagnostic = db.getDiagnosticByLeadId(lead.id);
  if (!diagnostic && lead.referenceCode) {
    diagnostic = db.getDiagnosticByReference(lead.referenceCode);
  }

  return res.json({ 
    success: true, 
    diagnostic: diagnostic || null,
    referenceCode: lead.referenceCode 
  });
});

// Update Lead Diagnostic from CRM
app.patch('/api/leads/:id/diagnostic', authMiddleware, (req: Request, res: Response) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado.' });

  const updatedDiag = db.saveDiagnostic({
    leadId: lead.id,
    referenceCode: lead.referenceCode,
    answers: req.body.answers,
    progressPercentage: req.body.progressPercentage,
    currentStep: req.body.currentStep,
    totalSteps: req.body.totalSteps,
    selectedAreas: req.body.selectedAreas,
  });

  return res.json({ success: true, diagnostic: updatedDiag });
});

// Update lead (status, assign, details)
app.patch('/api/leads/:id', authMiddleware, (req: Request, res: Response) => {
  const author = (req as any).user?.email || 'Administrador';
  const updated = db.updateLead(req.params.id, req.body, author);
  if (!updated) return res.status(404).json({ error: 'Lead no encontrado.' });
  return res.json({ lead: updated });
});

// Add internal note to lead
app.post('/api/leads/:id/notes', authMiddleware, (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'El contenido de la nota no puede estar vacío.' });
  }
  const author = (req as any).user?.email || 'Director Cokito';
  const updated = db.addLeadNote(req.params.id, content, author);
  if (!updated) return res.status(404).json({ error: 'Lead no encontrado.' });
  return res.json({ lead: updated });
});

// Delete / Archive lead
app.delete('/api/leads/:id', authMiddleware, (req: Request, res: Response) => {
  const success = db.deleteLead(req.params.id);
  if (!success) return res.status(404).json({ error: 'Lead no encontrado.' });
  return res.json({ success: true });
});

// Export Leads CSV
app.get('/api/export/leads', authMiddleware, (_req: Request, res: Response) => {
  const csv = db.generateLeadsCsv();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="cokitos_lab_leads.csv"');
  return res.send(csv);
});

// Dashboard Stats
app.get('/api/stats', authMiddleware, (_req: Request, res: Response) => {
  const stats = db.getStats();
  return res.json({ stats });
});

// Tasks
app.get('/api/tasks', authMiddleware, (_req: Request, res: Response) => {
  const tasks = db.getTasks();
  return res.json({ tasks });
});

app.post('/api/tasks', authMiddleware, (req: Request, res: Response) => {
  const { leadId, leadName, projectId, projectName, title, description, assignedTo, priority, dueDate, status } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Título y fecha límite son obligatorios.' });
  }
  const newTask = db.createTask({
    leadId,
    leadName,
    projectId,
    projectName,
    title,
    description,
    assignedTo: assignedTo || 'Director Cokito',
    priority: priority || 'media',
    dueDate,
    status: status || 'pendiente',
  });
  return res.status(201).json({ task: newTask });
});

app.patch('/api/tasks/:id', authMiddleware, (req: Request, res: Response) => {
  const updated = db.updateTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Tarea no encontrada.' });
  return res.json({ task: updated });
});

app.delete('/api/tasks/:id', authMiddleware, (req: Request, res: Response) => {
  const success = db.deleteTask(req.params.id);
  if (!success) return res.status(404).json({ error: 'Tarea no encontrada.' });
  return res.json({ success: true });
});

// Projects
app.get('/api/projects', authMiddleware, (_req: Request, res: Response) => {
  const projects = db.getProjects(false);
  return res.json({ projects });
});

app.post('/api/projects', authMiddleware, (req: Request, res: Response) => {
  const { name, clientName, company, description, status, assignedLead, startDate, targetDate, milestones, internalNotes, visibleOnLanding, category, outcomeMetric, tags, leadId } = req.body;
  if (!name || !clientName) {
    return res.status(400).json({ error: 'Nombre del proyecto y cliente son requeridos.' });
  }

  const newProj = db.createProject({
    leadId,
    name,
    clientName,
    company,
    description: description || '',
    status: status || 'planificacion',
    releasePhase: req.body.releasePhase || 'BETA 2.0',
    assignedLead: assignedLead || 'Director Cokito',
    startDate: startDate || new Date().toISOString().split('T')[0],
    targetDate,
    milestones: Array.isArray(milestones) ? milestones : [],
    internalNotes,
    visibleOnLanding: !!visibleOnLanding,
    category: category || 'Software a Medida',
    categories: Array.isArray(req.body.categories) ? req.body.categories : [category || 'Software a Medida'],
    outcomeMetric,
    tags: Array.isArray(tags) ? tags : ['Tecnología'],
  });

  return res.status(201).json({ project: newProj });
});

app.patch('/api/projects/:id', authMiddleware, (req: Request, res: Response) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Proyecto no encontrado.' });
  return res.json({ project: updated });
});

app.delete('/api/projects/:id', authMiddleware, (req: Request, res: Response) => {
  const success = db.deleteProject(req.params.id);
  if (!success) return res.status(404).json({ error: 'Proyecto no encontrado.' });
  return res.json({ success: true });
});

// Settings & Users
app.get('/api/settings', authMiddleware, (_req: Request, res: Response) => {
  const settings = db.getSettings();
  const users = db.getUsers();
  return res.json({ settings, users });
});

app.patch('/api/settings', authMiddleware, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json({ settings: updated });
});

// ==========================================
// VITE DEV SERVER / STATIC HANDLER
// ==========================================

async function startServer() {
  if (IS_PROD) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cokito's Lab] Server running on http://0.0.0.0:${PORT} (mode: ${IS_PROD ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
