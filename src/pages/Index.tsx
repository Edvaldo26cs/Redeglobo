import React, { useState, useEffect } from 'react';
import PlayerVideo from '@/components/PlayerVideo';
import ListaOcorrencias from '@/components/ListaOcorrencias';
import ModalDetalhesOcorrencia from '@/components/ModalDetalhesOcorrencia';
import NotificacaoOcorrencia from '@/components/NotificacaoOcorrencia';
import EPG from '@/components/EPG';

interface Ocorrencia {
  id: string;
  tipo: string;
  nivel: 'C' | 'B' | 'A' | 'X';
  timestamp: string;
  duracao: number;
  validada: boolean | null;
}

const Index = () => {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<Ocorrencia | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaOcorrencia, setNovaOcorrencia] = useState<Ocorrencia | null>(null);
  const [notificacaoVisivel, setNotificacaoVisivel] = useState(false);

  // Função para lidar com nova ocorrência detectada
  const lidarComNovaOcorrencia = (ocorrencia: Ocorrencia) => {
    setOcorrencias(prev => [ocorrencia, ...prev]);
    setNovaOcorrencia(ocorrencia);
    setNotificacaoVisivel(true);
  };

  // Função para abrir modal de detalhes
  const abrirDetalhesOcorrencia = (ocorrencia: Ocorrencia) => {
    setOcorrenciaSelecionada(ocorrencia);
    setModalAberto(true);
  };

  // Função para validar ocorrência
  const validarOcorrencia = (id: string, confirmada: boolean) => {
    setOcorrencias(prev => 
      prev.map(ocorrencia => 
        ocorrencia.id === id 
          ? { ...ocorrencia, validada: confirmada }
          : ocorrencia
      )
    );
  };

  // Função para fechar notificação
  const fecharNotificacao = () => {
    setNotificacaoVisivel(false);
    setNovaOcorrencia(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Layout principal - Player + EPG + Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[calc(100vh-200px)]">
          {/* Player de vídeo - 2/4 da largura */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Monitor de Transmissão ao Vivo
              </h1>
              <p className="text-muted-foreground">
                Sistema de monitoramento inteligente com IA para detecção de ocorrências em tempo real
              </p>
            </div>

            <PlayerVideo 
              aoDetectarOcorrencia={lidarComNovaOcorrencia}
            />

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-broadcast-secondary to-broadcast-accent p-4 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-foreground">
                  {ocorrencias.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de Ocorrências
                </div>
              </div>

              <div className="bg-gradient-to-br from-broadcast-secondary to-broadcast-accent p-4 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {ocorrencias.filter(o => o.validada === null).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Não Analisadas
                </div>
              </div>

              <div className="bg-gradient-to-br from-broadcast-secondary to-broadcast-accent p-4 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-red-500">
                  {ocorrencias.filter(o => o.validada === true).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Confirmadas
                </div>
              </div>

              <div className="bg-gradient-to-br from-broadcast-secondary to-broadcast-accent p-4 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-green-500">
                  {ocorrencias.filter(o => o.validada === false).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Falsos Positivos
                </div>
              </div>
            </div>
          </div>

          {/* EPG e Programação - 1/4 da largura */}
          <div className="lg:col-span-1 space-y-6">
            <EPG />
          </div>

          {/* Lista de ocorrências - 1/4 da largura */}
          <div className="lg:col-span-1">
            <ListaOcorrencias 
              ocorrencias={ocorrencias}
              aoClicarOcorrencia={abrirDetalhesOcorrencia}
              limite={20}
            />
          </div>
        </div>
      </div>

      {/* Modal de detalhes da ocorrência */}
      <ModalDetalhesOcorrencia
        ocorrencia={ocorrenciaSelecionada}
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoValidar={validarOcorrencia}
      />

      {/* Notificação de nova ocorrência */}
      {novaOcorrencia && (
        <NotificacaoOcorrencia
          visivel={notificacaoVisivel}
          tipo={novaOcorrencia.tipo}
          nivel={novaOcorrencia.nivel}
          aoFechar={fecharNotificacao}
        />
      )}
    </main>
  );
};

export default Index;
