import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Definição da ocorrência
interface Ocorrencia {
  id: string;
  tipo: 'tela_escura' | 'freeze' | 'lipsync' | 'corte';
  nivel: 'C' | 'B' | 'A' | 'X';
  timestamp: string;
  duracao: number;
  validada: boolean | null; // null = não analisada, true = confirmada, false = falso positivo
}

interface PlayerVideoProps {
  linkSrt?: string;
  aoDetectarOcorrencia?: (ocorrencia: Ocorrencia) => void;
}

const PlayerVideo: React.FC<PlayerVideoProps> = ({ 
  linkSrt = '', 
  aoDetectarOcorrencia 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Função para alternar reprodução
  const alternarReproducao = () => {
    if (videoRef.current) {
      if (reproduzindo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // evita erro em navegadores que bloqueiam autoplay
        });
      }
      setReproduzindo(!reproduzindo);
    }
  };

  // Simulação de detecção de IA (será substituído por integração real)
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (Math.random() < 0.1 && aoDetectarOcorrencia) {
        const tiposOcorrencia: Ocorrencia['tipo'][] = ['tela_escura', 'freeze', 'lipsync', 'corte'];
        const niveis: Ocorrencia['nivel'][] = ['C', 'B', 'A', 'X'];
        
        const ocorrencia: Ocorrencia = {
          id: Date.now().toString(),
          tipo: tiposOcorrencia[Math.floor(Math.random() * tiposOcorrencia.length)],
          nivel: niveis[Math.floor(Math.random() * niveis.length)],
          timestamp: new Date().toISOString(),
          duracao: Math.floor(Math.random() * 30) + 1,
          validada: null
        };
        
        aoDetectarOcorrencia(ocorrencia);
      }
    }, 3000); // Verifica a cada 3 segundos

    return () => clearInterval(intervalo);
  }, [aoDetectarOcorrencia]);

  return (
    <Card className="p-4 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent shadow-lg">
      <div className="space-y-4">
        {/* Cabeçalho do player */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Transmissão ao Vivo
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AO VIVO</span>
          </div>
        </div>

        {/* Player de vídeo */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-inner">
          {linkSrt ? (
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              src={linkSrt}
              onLoadStart={() => setCarregando(true)}
              onLoadedData={() => setCarregando(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center space-y-4">
                <Settings className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Configure o link SRT nas configurações
                </p>
              </div>
            </div>
          )}

          {/* Overlay de carregamento */}
          {carregando && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Controles do player */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={alternarReproducao}
                className="text-white hover:bg-white/20"
                disabled={!linkSrt}
              >
                {reproduzindo ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                disabled={!linkSrt}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              
              <div className="flex-1" />
              
              {/* Indicador de qualidade */}
              <div className="text-xs text-white/80">
                {linkSrt ? '1080p' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Status da IA */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">IA Monitorando</span>
          </div>
          <span className="text-muted-foreground">
            Última verificação: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PlayerVideo;
