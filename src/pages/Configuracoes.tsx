import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Save, 
  TestTube, 
  Volume2, 
  Bell, 
  Monitor,
  Wifi,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Configuracoes: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações de transmissão
    linkSrt: 'srt://servidor.exemplo.com:1935/stream',
    timeoutConexao: 30,
    tentativasReconexao: 3,
    
    // Configurações de IA
    sensibilidadeDeteccao: 'media',
    intervalosVerificacao: 2,
    tiposOcorrenciaAtivos: {
      tela_escura: true,
      freeze: true,
      lipsync: true,
      corte: true,
      fade: false,
      imagem_errada: true,
      reporter_parado: false,
      variacao_pixels: true
    },
    
    // Configurações de notificação
    notificacoesVisuais: true,
    notificacoesSonoras: true,
    volumeNotificacoes: 80,
    duracaoNotificacao: 5,
    
    // Configurações de armazenamento
    tempoRetencaoGravacoes: 30,
    qualidadeGravacao: 'alta',
    compressaoAutomatica: true,
    
    // Configurações de sistema
    modoDebug: false,
    logDetalhado: false,
    backupAutomatico: true
  });

  const [testando, setTestando] = useState(false);
  const [statusTeste, setStatusTeste] = useState<'sucesso' | 'erro' | null>(null);
  const { toast } = useToast();

  // Função para atualizar configuração
  const atualizarConfiguracao = (chave: string, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
  };

  // Função para atualizar configuração aninhada
  const atualizarConfiguracaoAninhada = (chave: string, subChave: string, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: {
        ...(prev[chave as keyof typeof prev] as Record<string, any>),
        [subChave]: valor
      }
    }));
  };

  // Função para testar conexão SRT
  const testarConexaoSrt = async () => {
    setTestando(true);
    setStatusTeste(null);
    
    // Simula teste de conexão
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula sucesso/erro aleatório para demonstração
      if (Math.random() > 0.3) {
        setStatusTeste('sucesso');
        toast({
          title: "Conexão SRT Testada",
          description: "A conexão com o servidor SRT foi estabelecida com sucesso!",
        });
      } else {
        setStatusTeste('erro');
        toast({
          title: "Erro na Conexão SRT",
          description: "Não foi possível conectar ao servidor SRT. Verifique o link e tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setStatusTeste('erro');
    } finally {
      setTestando(false);
    }
  };

  // Função para salvar configurações
  const salvarConfiguracoes = () => {
    // Aqui seria feita a persistência no backend
    toast({
      title: "Configurações Salvas",
      description: "Todas as configurações foram salvas com sucesso!",
    });
  };

  // Função para resetar configurações
  const resetarConfiguracoes = () => {
    // Resetar para valores padrão
    toast({
      title: "Configurações Resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground">
            Configure os parâmetros do sistema de monitoramento e IA
          </p>
        </div>

        {/* Configurações de Transmissão */}
        <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Configurações de Transmissão
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkSrt">Link SRT da Transmissão</Label>
              <div className="flex gap-2">
                <Input
                  id="linkSrt"
                  value={configuracoes.linkSrt}
                  onChange={(e) => atualizarConfiguracao('linkSrt', e.target.value)}
                  placeholder="srt://servidor:porta/stream"
                  className="flex-1"
                />
                <Button 
                  onClick={testarConexaoSrt}
                  disabled={testando}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {testando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4" />
                      Testar
                    </>
                  )}
                </Button>
              </div>
              
              {statusTeste && (
                <div className={`flex items-center gap-2 text-sm ${
                  statusTeste === 'sucesso' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {statusTeste === 'sucesso' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {statusTeste === 'sucesso' 
                    ? 'Conexão estabelecida com sucesso' 
                    : 'Falha na conexão - verifique o link'
                  }
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout de Conexão (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={configuracoes.timeoutConexao}
                  onChange={(e) => atualizarConfiguracao('timeoutConexao', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tentativas">Tentativas de Reconexão</Label>
                <Input
                  id="tentativas"
                  type="number"
                  value={configuracoes.tentativasReconexao}
                  onChange={(e) => atualizarConfiguracao('tentativasReconexao', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Configurações de IA */}
        <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Configurações da IA
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sensibilidade">Sensibilidade de Detecção</Label>
                <Select
                  value={configuracoes.sensibilidadeDeteccao}
                  onValueChange={(value) => atualizarConfiguracao('sensibilidadeDeteccao', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa - Menos sensível</SelectItem>
                    <SelectItem value="media">Média - Equilibrada</SelectItem>
                    <SelectItem value="alta">Alta - Mais sensível</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intervalo">Intervalo de Verificação (segundos)</Label>
                <Input
                  id="intervalo"
                  type="number"
                  min="1"
                  max="10"
                  value={configuracoes.intervalosVerificacao}
                  onChange={(e) => atualizarConfiguracao('intervalosVerificacao', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipos de Ocorrência Ativos</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(configuracoes.tiposOcorrenciaAtivos).map(([tipo, ativo]) => {
                  const labels = {
                    tela_escura: 'Tela Escura',
                    freeze: 'Tela Congelada',
                    lipsync: 'Lipsync Desalinhado',
                    corte: 'Corte no Programa',
                    fade: 'Fade Inesperado',
                    imagem_errada: 'Imagem Errada',
                    reporter_parado: 'Reporter Parado',
                    variacao_pixels: 'Variação de Pixels'
                  };

                  return (
                    <div key={tipo} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <span className="text-sm text-foreground">
                        {labels[tipo as keyof typeof labels]}
                      </span>
                      <Switch
                        checked={ativo}
                        onCheckedChange={(checked) => 
                          atualizarConfiguracaoAninhada('tiposOcorrenciaAtivos', tipo, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Configurações de Notificação */}
        <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Notificação
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificacoes-visuais">Notificações Visuais</Label>
                  <Switch
                    id="notificacoes-visuais"
                    checked={configuracoes.notificacoesVisuais}
                    onCheckedChange={(checked) => atualizarConfiguracao('notificacoesVisuais', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notificacoes-sonoras">Notificações Sonoras</Label>
                  <Switch
                    id="notificacoes-sonoras"
                    checked={configuracoes.notificacoesSonoras}
                    onCheckedChange={(checked) => atualizarConfiguracao('notificacoesSonoras', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume das Notificações (%)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="volume"
                      type="range"
                      min="0"
                      max="100"
                      value={configuracoes.volumeNotificacoes}
                      onChange={(e) => atualizarConfiguracao('volumeNotificacoes', parseInt(e.target.value))}
                      className="flex-1"
                      disabled={!configuracoes.notificacoesSonoras}
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground w-12">
                      {configuracoes.volumeNotificacoes}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração da Notificação (segundos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    max="10"
                    value={configuracoes.duracaoNotificacao}
                    onChange={(e) => atualizarConfiguracao('duracaoNotificacao', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Botões de ação */}
        <div className="flex items-center gap-4 pt-6">
          <Button 
            onClick={salvarConfiguracoes}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetarConfiguracoes}
          >
            Restaurar Padrões
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;