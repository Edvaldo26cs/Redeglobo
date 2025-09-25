import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificacaoOcorrenciaProps {
  visivel: boolean;
  tipo: string;
  nivel: 'C' | 'B' | 'A' | 'X';
  aoFechar: () => void;
}

const NotificacaoOcorrencia: React.FC<NotificacaoOcorrenciaProps> = ({
  visivel,
  tipo,
  nivel,
  aoFechar
}) => {
  const [mostrandoNotificacao, setMostrandoNotificacao] = useState(false);

  // Auto-fechar após 5 segundos
  useEffect(() => {
    if (visivel) {
      setMostrandoNotificacao(true);
      
      // Som de notificação (opcional - pode ser adicionado)
      // const audio = new Audio('/notification.wav');
      // audio.play().catch(() => {}); // Ignora erros de autoplay
      
      const timer = setTimeout(() => {
        fecharNotificacao();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visivel]);

  const fecharNotificacao = () => {
    setMostrandoNotificacao(false);
    setTimeout(() => {
      aoFechar();
    }, 300); // Tempo para animação de saída
  };

  // Função para formatar tipo de ocorrência
  const formatarTipoOcorrencia = (tipo: string) => {
    const tipos = {
      'tela_escura': 'Tela Escura',
      'freeze': 'Tela Congelada',
      'lipsync': 'Lipsync Desalinhado',
      'corte': 'Corte no Programa',
      'fade': 'Fade Inesperado',
      'imagem_errada': 'Imagem Errada',
      'reporter_parado': 'Reporter Parado',
      'variacao_pixels': 'Variação de Pixels'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  // Função para obter cor do nível
  const obterCorNivel = (nivel: string) => {
    const cores = {
      'C': 'from-nivel-c to-green-600',
      'B': 'from-nivel-b to-yellow-600', 
      'A': 'from-nivel-a to-orange-600',
      'X': 'from-nivel-x to-red-700'
    };
    return cores[nivel as keyof typeof cores] || 'from-muted to-muted-foreground';
  };

  if (!visivel && !mostrandoNotificacao) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`
          transform transition-all duration-300 ease-out
          ${mostrandoNotificacao && visivel 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        <div className={`
          bg-gradient-to-r ${obterCorNivel(nivel)}
          text-white rounded-lg shadow-2xl p-4 pr-12 max-w-sm
          border border-white/20 backdrop-blur-sm
        `}>
          {/* Botão fechar */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white hover:bg-white/20 h-6 w-6 p-0"
            onClick={fecharNotificacao}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Conteúdo da notificação */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
            </div>
            
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm">
                Nova Ocorrência Detectada!
              </h4>
              <p className="text-sm opacity-90">
                {formatarTipoOcorrencia(tipo)}
              </p>
              <p className="text-xs opacity-75">
                Nível {nivel} - {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Barra de progresso para auto-fechar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white/60 transition-all duration-5000 ease-linear"
              style={{
                width: mostrandoNotificacao && visivel ? '0%' : '100%',
                transitionDuration: '5000ms'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacaoOcorrencia;