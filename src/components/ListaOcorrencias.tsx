import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, AlertTriangle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Ocorrencia {
  id: string;
  tipo: string;
  nivel: 'C' | 'B' | 'A' | 'X';
  timestamp: string;
  duracao: number;
  validada: boolean | null;
}

interface ListaOcorrenciasProps {
  ocorrencias: Ocorrencia[];
  aoClicarOcorrencia: (ocorrencia: Ocorrencia) => void;
  limite?: number;
}

const ListaOcorrencias: React.FC<ListaOcorrenciasProps> = ({
  ocorrencias,
  aoClicarOcorrencia,
  limite = 20
}) => {
  // Pega as ocorrências mais recentes
  const ocorrenciasRecentes = ocorrencias
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limite);

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
      'C': 'Leve (≤ 4s)',
      'B': 'Médio (≤ 9s)',
      'A': 'Grave (≤ 59s)', 
      'X': 'Gravíssimo (≥ 60s)'
    };
    return descricoes[nivel as keyof typeof descricoes] || 'Desconhecido';
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

  // Função para obter ícone de status de validação
  const obterStatusValidacao = (validada: boolean | null) => {
    if (validada === null) return { icon: Eye, color: 'text-muted-foreground', texto: 'Não analisada' };
    if (validada === true) return { icon: AlertTriangle, color: 'text-red-500', texto: 'Confirmada' };
    return { icon: Eye, color: 'text-green-500', texto: 'Falso positivo' };
  };

  return (
    <Card className="h-full bg-gradient-to-br from-broadcast-secondary to-broadcast-accent shadow-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Ocorrências Recentes
          </h2>
          <Badge variant="secondary" className="text-xs">
            {ocorrenciasRecentes.length} de {ocorrencias.length}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        {ocorrenciasRecentes.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground font-medium">
                Nenhuma ocorrência detectada
              </p>
              <p className="text-sm text-muted-foreground">
                A IA está monitorando continuamente
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {ocorrenciasRecentes.map((ocorrencia) => {
              const StatusIcon = obterStatusValidacao(ocorrencia.validada).icon;
              const statusColor = obterStatusValidacao(ocorrencia.validada).color;
              const statusTexto = obterStatusValidacao(ocorrencia.validada).texto;

              return (
                <Card
                  key={ocorrencia.id}
                  className="p-3 hover:bg-accent/50 transition-all cursor-pointer border-l-4 border-l-primary/50"
                  onClick={() => aoClicarOcorrencia(ocorrencia)}
                >
                  <div className="space-y-3">
                    {/* Cabeçalho da ocorrência */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`text-xs font-semibold ${obterCorNivel(ocorrencia.nivel)}`}
                        >
                          Nível {ocorrencia.nivel}
                        </Badge>
                        <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(ocorrencia.timestamp), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    </div>

                    {/* Tipo e descrição */}
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {formatarTipoOcorrencia(ocorrencia.tipo)}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {obterDescricaoNivel(ocorrencia.nivel)}
                      </p>
                    </div>

                    {/* Detalhes da ocorrência */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Duração: {ocorrencia.duracao}s
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={statusColor}>
                          {statusTexto}
                        </span>
                      </div>
                    </div>

                    {/* Botão de ação */}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="w-full mt-2 text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ListaOcorrencias;