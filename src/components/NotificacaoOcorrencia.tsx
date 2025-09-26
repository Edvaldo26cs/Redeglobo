import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  // refs para timers (para podermos limpar corretamente)
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // fecharNotificacao memoizada para não recriar em toda render
  const fecharNotificacao = useCallback(() => {
    // inicia animação de saída
    setMostrandoNotificacao(false);

    // limpa timer de fechamento anterior (se houver)
    if (closeDelayTimerRef.current) {
      clearTimeout(closeDelayTimerRef.current);
    }

    // espera a animação terminar e então chama aoFechar (300ms)
    closeDelayTimerRef.current = setTimeout(() => {
      aoFechar();
      closeDelayTimerRef.current = null;
    }, 300);
  }, [aoFechar]);

  // efeito que inicia o auto-close quando `visivel` vira true
  useEffect(() => {
    // quando visivel for true, mostra e programa o auto-close
    if (visivel) {
      setMostrandoNotificacao(true);

      // limpa timer antigo caso exista
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      autoCloseTimerRef.current = setTimeout(() => {
        fecharNotificacao();
        autoCloseTimerRef.current = null;
      }, 5000);
    } else {
      // se visivel for false (externamente), limpamos o timer de auto-close
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    }

    // cleanup para quando o effect rerodar ou o componente desmontar
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [visivel, fecharNotificacao]);

  // garante limpeza final ao desmontar (também limpa o timer do delay de fechamento)
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
      if (closeDelayTimerRef.current) {
        clearTimeout(closeDelayTimerRef.current);
        closeDelayTimerRef.current = null;
      }
    };
  }, []);

  // resto do componente (funções auxiliares mantive as suas)
  const formatarTipoOcorrencia = (tipo: string) => {
    const tipos: Record<string, string> = {
      tela_escura: 'Tela Escura',
      freeze: 'Tela Congelada',
      lipsync: 'Lipsync Desalinhado',
      corte: 'Corte no Programa',
      fade: 'Fade Inesperado',
      imagem_errada: 'Imagem Errada',
      reporter_parado: 'Reporter Parado',
      variacao_pixels: 'Variação de Pixels'
    };
    return tipos[tipo] || tipo;
  };

  const obterCorNivel = (nivel: string) => {
    const cores: Record<string, string> = {
      C: 'from-nivel-c to-green-600',
      B: 'from-nivel-b to-yellow-600',
      A: 'from-nivel-a to-orange-600',
      X: 'from-nivel-x to-red-700'
    };
    return cores[nivel] || 'from-muted to-muted-foreground';
  };

  if (!visivel && !mostrandoNotificacao) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`transform transition-all duration-300 ease-out ${
          mostrandoNotificacao && visivel
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        <div
          className={`bg-gradient-to-r ${obterCorNivel(
            nivel
          )} text-white rounded-lg shadow-2xl p-4 pr-12 max-w-sm border border-white/20 backdrop-blur-sm`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white hover:bg-white/20 h-6 w-6 p-0"
            onClick={fecharNotificacao}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm">Nova Ocorrência Detectada!</h4>
              <p className="text-sm opacity-90">{formatarTipoOcorrencia(tipo)}</p>
              <p className="text-xs opacity-75">Nível {nivel} - {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-white/60 transition-all ease-linear"
              style={{
                // se quiser, ajuste a animação da barra (ver observações abaixo)
                width: mostrandoNotificacao && visivel ? '100%' : '0%',
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
