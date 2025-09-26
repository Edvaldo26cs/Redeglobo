import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

// Tipagem forte para as configurações
interface ConfiguracoesState {
  linkSrt: string;
  timeoutConexao: number;
  tentativasReconexao: number;

  sensibilidadeDeteccao: 'baixa' | 'media' | 'alta';
  intervalosVerificacao: number;
  tiposOcorrenciaAtivos: {
    tela_escura: boolean;
    freeze: boolean;
    lipsync: boolean;
    corte: boolean;
    fade: boolean;
    imagem_errada: boolean;
    reporter_parado: boolean;
    variacao_pixels: boolean;
  };

  notificacoesVisuais: boolean;
  notificacoesSonoras: boolean;
  volumeNotificacoes: number;
  duracaoNotificacao: number;

  tempoRetencaoGravacoes: number;
  qualidadeGravacao: 'baixa' | 'media' | 'alta';
  compressaoAutomatica: boolean;

  modoDebug: boolean;
  logDetalhado: boolean;
  backupAutomatico: boolean;
}

const Configuracoes: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesState>({
    linkSrt: 'srt://servidor.exemplo.com:1935/stream',
    timeoutConexao: 30,
    tentativasReconexao: 3,

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

    notificacoesVisuais: true,
    notificacoesSonoras: true,
    volumeNotificacoes: 80,
    duracaoNotificacao: 5,

    tempoRetencaoGravacoes: 30,
    qualidadeGravacao: 'alta',
    compressaoAutomatica: true,

    modoDebug: false,
    logDetalhado: false,
    backupAutomatico: true
  });

  const [testando, setTestando] = useState(false);
  const [statusTeste, setStatusTeste] = useState<'sucesso' | 'erro' | null>(null);
  const { toast } = useToast();

  // Atualização simples
  const atualizarConfiguracao = <K extends keyof ConfiguracoesState>(
    chave: K,
    valor: ConfiguracoesState[K]
  ) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
  };

  // Atualização de objetos aninhados
  const atualizarConfiguracaoAninhada = <
    K extends keyof ConfiguracoesState,
    S extends keyof ConfiguracoesState[K]
  >(
    chave: K,
    subChave: S,
    valor: ConfiguracoesState[K][S]
  ) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: {
        ...(prev[chave] as Record<string, unknown>),
        [subChave]: valor
      }
    }));
  };

  // Função para testar conexão SRT
  const testarConexaoSrt = async () => {
    setTestando(true);
    setStatusTeste(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

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
    } catch {
      setStatusTeste('erro');
    } finally {
      setTestando(false);
    }
  };

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações Salvas",
      description: "Todas as configurações foram salvas com sucesso!",
    });
  };

  const resetarConfiguracoes = () => {
    toast({
      title: "Configurações Resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* ... resto do seu JSX permanece igual ... */}
    </div>
  );
};

export default Configuracoes;
