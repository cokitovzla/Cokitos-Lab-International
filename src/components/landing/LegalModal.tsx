import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#143247] bg-[#081722]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00D9F5]" />
            <h3 className="text-lg font-bold text-[#F5FBFF]">
              {type === 'privacy' ? 'Política de Privacidad y Tratamiento de Datos' : 'Términos de Servicio y Condiciones'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5FBFF]/60 hover:text-[#F5FBFF] hover:bg-[#143247] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#F5FBFF]/80 leading-relaxed font-sans">
          {type === 'privacy' ? (
            <>
              <p className="font-semibold text-[#00D9F5]">
                1. Compromiso de Confidencialidad
              </p>
              <p>
                En <strong>Cokito’s Lab</strong> tratamos la información de cada proyecto con la mayor confidencialidad. Los datos recolectados a través de nuestro formulario de contacto (nombre, correo electrónico, teléfono, empresa y descripción de la necesidad) se emplean exclusivamente para evaluar el alcance técnico y establecer contacto directo con el remitente.
              </p>

              <p className="font-semibold text-[#00D9F5]">
                2. Almacenamiento Seguro y No Divulgación
              </p>
              <p>
                No vendemos, cedemos ni compartimos información personal o técnica a terceros con fines publicitarios. Todos los registros se resguardan en nuestra base de datos administrativa interna con control de acceso por roles y protocolos de seguridad en la nube.
              </p>

              <p className="font-semibold text-[#00D9F5]">
                3. Derechos del Usuario
              </p>
              <p>
                Puedes solicitar en cualquier momento la actualización, consulta o eliminación total de tus datos de nuestros sistemas escribiendo a <code>contacto@cokitoslab.com</code>.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#00D9F5]">
                1. Naturaleza de los Servicios
              </p>
              <p>
                <strong>Cokito’s Lab</strong> es un laboratorio de innovación y tecnología aplicada especializado en software a medida, automatizaciones operativas, diseño de CRMs y consultoría de ingeniería.
              </p>

              <p className="font-semibold text-[#00D9F5]">
                2. Propiedad Intelectual de Desarrollos
              </p>
              <p>
                Los códigos fuente, plataformas y sistemas construidos para clientes se entregan bajo las condiciones pactadas en cada acuerdo de servicio, garantizando la titularidad convenida del software a la entrega formal del proyecto.
              </p>

              <p className="font-semibold text-[#00D9F5]">
                3. Transparencia y Métricas Reales
              </p>
              <p>
                Nuestra filosofía prioriza resultados comprobables y verificados. Todas las estimaciones de cronograma y viabilidad se realizan sobre análisis técnicos objetivos antes de iniciar la etapa de construcción.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#143247] bg-[#081722] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00D9F5] text-[#0B1F2D] text-xs font-bold rounded-md hover:bg-[#00E3B2] transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
