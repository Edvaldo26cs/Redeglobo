import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  Calendar,
  Timer,
  AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Ocorrencia {
  id: string;
  tipo: string;
  nivel: 'C' | 'B' | 'A' | 'X';
  timestamp: string;
  duracao: number;
  validada: boolean | null;
  programa?: string;
  categoria?: string;
}

interface ModalDetalhesOcorrenciaProps {
  ocorrencia: Ocorrencia | null;
  aberto: boolean;
  aoFechar: () => void;
  aoValidar: (id: string, confirmada: boolean) => void;
}

const ModalDetalhesOcorrencia: React.FC<ModalDetalhesOcorrenciaProps> = ({
  ocorrencia,
  aberto,
  aoFechar,
  aoValidar
}) => {
  const [reproduzindo, setReproduzindo] = useState(false);
  const { toast } = useToast();

  if (!ocorrencia) return null;

  // Função para obter cor do nível
  const obterCorNivel = (nivel: string) => {
    const cores = {
      'C': 'bg-nivel-c text-white',
      'B': 'bg-nivel-b text-white', 
      'A': 'bg-nivel-a text-white',
      'X': 'bg-nivel-x text-white'
    };
    return cores[nivel as keyof typeof cores] || 'bg-muted';
  };

  // Função para obter descrição do nível
  const obterDescricaoNivel = (nivel: string) => {
    const descricoes = {
      'C': 'Ocorrência Leve (≤ 4 segundos)',
      'B': 'Ocorrência Média (≤ 9 segundos)',
      'A': 'Ocorrência Grave (≤ 59 segundos)', 
      'X': 'Ocorrência Gravíssima (≥ 60 segundos)'
    };
    return descricoes[nivel as keyof typeof descricoes] || 'Nível Desconhecido';
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

  // Função para alternar reprodução do vídeo
  const alternarReproducao = () => {
    setReproduzindo(!reproduzindo);
  };

  // Função para confirmar ocorrência
  const confirmarOcorrencia = () => {
    aoValidar(ocorrencia.id, true);
    toast({
      title: "Ocorrência Confirmada",
      description: "A ocorrência foi marcada como válida.",
    });
    aoFechar();
  };

  // Função para marcar como falso positivo
  const marcarFalsoPositivo = () => {
    aoValidar(ocorrencia.id, false);
    toast({
      title: "Falso Positivo",
      description: "A ocorrência foi marcada como falso positivo.",
    });
    aoFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Detalhes da Ocorrência
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Player de vídeo da ocorrência */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-foreground">
                Gravação da Ocorrência
              </h3>
              
              {/* Player simulado - aqui seria o vídeo real da ocorrência */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center space-y-4">
                    <Play className="mx-auto h-16 w-16 text-white/60" />
                    <p className="text-white/60">
                      Gravação da ocorrência de {ocorrencia.duracao}s
                    </p>
                  </div>
                </div>

                {/* Controles do player */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={alternarReproducao}
                      className="text-white hover:bg-white/20"
                    >
                      {reproduzindo ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div className="bg-primary rounded-full h-full w-0" />
                    </div>
                    
                    <span className="text-xs text-white">
                      00:00 / 00:{String(ocorrencia.duracao).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Informações detalhadas */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-foreground">
                Informações da Ocorrência
              </h3>
              
              <div className="space-y-4">
                {/* Nível e tipo */}
                <div className="flex items-center gap-3">
                  <Badge className={`text-sm font-semibold ${obterCorNivel(ocorrencia.nivel)}`}>
                    Nível {ocorrencia.nivel}
                  </Badge>
                  <span className="text-foreground font-medium">
                    {formatarTipoOcorrencia(ocorrencia.tipo)}
                  </span>
                </div>

                {/* Descrição do nível */}
                <p className="text-muted-foreground text-sm">
                  {obterDescricaoNivel(ocorrencia.nivel)}
                </p>

                {/* Detalhes temporais */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Data/Hora:</span>
                    <span className="text-foreground font-medium">
                      {format(new Date(ocorrencia.timestamp), 'dd/MM/yyyy HH:mm:ss', {
                        locale: ptBR
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="text-foreground font-medium">
                      {ocorrencia.duracao} segundo{ocorrencia.duracao !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID da Ocorrência:</span>
                    <span className="text-foreground font-mono text-xs">
                      {ocorrencia.id}
                    </span>
                  </div>

                  {ocorrencia.programa && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Programa:</span>
                      <span className="text-foreground font-medium">
                        {ocorrencia.programa}
                      </span>
                    </div>
                  )}

                  {ocorrencia.categoria && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span className="text-foreground font-medium">
                        {ocorrencia.categoria}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status atual */}
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2 text-foreground">Status de Validação</h4>
                  {ocorrencia.validada === null ? (
                    <Badge variant="secondary" className="text-xs">
                      Aguardando Análise
                    </Badge>
                  ) : ocorrencia.validada ? (
                    <Badge className="bg-red-500 text-white text-xs">
                      Ocorrência Confirmada
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500 text-white text-xs">
                      Falso Positivo
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Botões de validação */}
            {ocorrencia.validada === null && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4 text-foreground">
                  Validação da Ocorrência
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Após analisar a gravação, confirme se esta é uma ocorrência válida ou um falso positivo.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={confirmarOcorrencia}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Ocorrência
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={marcarFalsoPositivo}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Falso Positivo
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalhesOcorrencia;