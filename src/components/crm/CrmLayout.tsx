import React, { useState, useEffect } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { 
  Lead, 
  Task, 
  Project, 
  User, 
  DashboardStats 
} from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { DashboardView } from './DashboardView.tsx';
import { ContactsView } from './ContactsView.tsx';
import { PipelineKanbanView } from './PipelineKanbanView.tsx';
import { TasksView } from './TasksView.tsx';
import { ProjectsView } from './ProjectsView.tsx';
import { SettingsView } from './SettingsView.tsx';
import { ContactDetailModal } from './ContactDetailModal.tsx';
import { NewContactModal } from './NewContactModal.tsx';
import { 
  LayoutDashboard, 
  Users, 
  Columns3, 
  CheckSquare, 
  Layers, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Bell, 
  ShieldCheck, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

interface CrmLayoutProps {
  currentUser: User;
  onLogout: () => void;
  onBackToLanding: () => void;
}

export const CrmLayout: React.FC<CrmLayoutProps> = ({
  currentUser,
  onLogout,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'kanban' | 'tasks' | 'projects' | 'settings'>('dashboard');
  
  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch all CRM data
  const refreshAllData = async () => {
    try {
      const [leadsRes, tasksRes, projectsRes, statsRes] = await Promise.all([
        api.getLeads(),
        api.getTasks(),
        api.getProjects(),
        api.getStats(),
      ]);
      setLeads(leadsRes.leads);
      setTasks(tasksRes.tasks);
      setProjects(projectsRes.projects);
      setStats(statsRes.stats);
    } catch (e) {
      console.error('Error refreshing CRM data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleOpenLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleLeadUpdated = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
    if (selectedLead?.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
    // Refresh stats
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleLeadDeleted = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selectedLead?.id === id) {
      setIsDetailModalOpen(false);
      setSelectedLead(null);
    }
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleLeadCreated = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleTaskUpdated = (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleTaskCreated = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleTaskDeleted = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleProjectUpdated = (project: Project) => {
    setProjects(prev => prev.map(p => (p.id === project.id ? project : p)));
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const handleProjectDeleted = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    api.getStats().then(res => setStats(res.stats)).catch(() => {});
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Contactos & Leads', icon: Users, badge: leads.filter(l => l.status === 'nuevo_contacto').length },
    { id: 'kanban', label: 'Pipeline Comercial', icon: Columns3 },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: tasks.filter(t => t.status !== 'completada').length },
    { id: 'projects', label: 'Proyectos', icon: Layers },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#081722] text-[#F5FBFF] flex flex-col antialiased">
      
      {/* Top Bar */}
      <header className="bg-[#0B1F2D] border-b border-[#143247] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 text-[#F5FBFF] hover:bg-[#143247] rounded-md"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-mono text-[#00D9F5] hover:text-[#00E3B2] transition-colors cursor-pointer mr-2"
            title="Volver a la Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Landing Page</span>
          </button>

          <div className="h-4 w-px bg-[#143247] hidden sm:block" />

          <div className="flex items-center gap-2">
            <LabLogo variant="compact" size="sm" />
            <span className="font-mono text-xs text-[#00D9F5] bg-[#00D9F5]/10 px-2 py-0.5 rounded border border-[#00D9F5]/30 hidden md:inline">
              CONTROL CENTER CRM V1.0
            </span>
          </div>
        </div>

        {/* User Info & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={refreshAllData}
            className="p-2 text-[#F5FBFF]/70 hover:text-[#00D9F5] hover:bg-[#143247] rounded-md transition-colors"
            title="Sincronizar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#F5FBFF]/80">
            <ShieldCheck className="w-4 h-4 text-[#00E3B2]" />
            <span>{currentUser.name}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#143247] hover:bg-rose-950/60 hover:text-rose-400 text-xs font-mono text-[#F5FBFF]/80 transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#0B1F2D] border-r border-[#143247] p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#F5FBFF]/40 uppercase tracking-widest px-3 mb-2 block">
              Módulos Operativos
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-sm shadow-[#00D9F5]/20'
                      : 'text-[#F5FBFF]/75 hover:bg-[#122e43] hover:text-[#F5FBFF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? 'bg-[#0B1F2D] text-[#00D9F5]'
                          : 'bg-[#00D9F5]/20 text-[#00D9F5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Lab Diagnostic Info */}
          <div className="p-3.5 rounded-xl bg-[#081722] border border-[#16364d] space-y-2 text-[11px] font-mono text-[#F5FBFF]/60">
            <div className="flex items-center justify-between">
              <span>Almacenamiento:</span>
              <span className="text-[#00E3B2] font-bold">Persistente</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Leads Activos:</span>
              <span className="text-[#00D9F5] font-bold tabular-nums">{leads.length}</span>
            </div>
            <div className="pt-2 border-t border-[#143247] text-[10px] text-[#F5FBFF]/40">
              Cokito's Lab · PostgreSQL / JSON Engine
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-black/80 flex">
            <div className="w-64 bg-[#0B1F2D] p-4 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#143247]">
                  <LabLogo variant="compact" size="sm" />
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-[#F5FBFF]/70" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono ${
                        isActive
                          ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold'
                          : 'text-[#F5FBFF]/80 hover:bg-[#143247]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D9F5]/20 text-[#00D9F5]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onBackToLanding}
                className="w-full py-2.5 bg-[#143247] text-xs font-mono text-[#00D9F5] rounded-md"
              >
                Volver a Landing Page
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-tech-grid">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              leads={leads}
              tasks={tasks}
              projects={projects}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onSelectLead={handleOpenLeadDetail}
              onOpenNewContactModal={() => setIsNewContactModalOpen(true)}
            />
          )}

          {activeTab === 'leads' && (
            <ContactsView
              leads={leads}
              onSelectLead={handleOpenLeadDetail}
              onLeadUpdated={handleLeadUpdated}
              onLeadDeleted={handleLeadDeleted}
              onOpenNewContactModal={() => setIsNewContactModalOpen(true)}
            />
          )}

          {activeTab === 'kanban' && (
            <PipelineKanbanView
              leads={leads}
              onSelectLead={handleOpenLeadDetail}
              onLeadUpdated={handleLeadUpdated}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              leads={leads}
              onTaskUpdated={handleTaskUpdated}
              onTaskCreated={handleTaskCreated}
              onTaskDeleted={handleTaskDeleted}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              leads={leads}
              onProjectUpdated={handleProjectUpdated}
              onProjectCreated={handleProjectCreated}
              onProjectDeleted={handleProjectDeleted}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView currentUser={currentUser} />
          )}
        </main>

      </div>

      {/* Modals */}
      <ContactDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
        onLeadUpdated={handleLeadUpdated}
        onLeadConvertedToProject={(proj) => {
          handleProjectCreated(proj);
          setActiveTab('projects');
        }}
      />

      <NewContactModal
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onLeadCreated={(lead) => {
          handleLeadCreated(lead);
          handleOpenLeadDetail(lead);
        }}
      />

    </div>
  );
};
