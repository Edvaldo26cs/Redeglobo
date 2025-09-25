import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import ModalDetalhesOcorrencia from '@/components/ModalDetalhesOcorrencia';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

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

const Ocorrencias: React.FC = () => {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroPrograma, setFiltroPrograma] = useState<string>('todos');
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<Ocorrencia | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ocorrenciasPorPagina = 10;

  // Dados simulados - substituir por dados reais da API
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([
    {
      id: '1',
      tipo: 'tela_escura',
      nivel: 'B',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      duracao: 8,
      validada: true,
      programa: 'Jornal Nacional',
      categoria: 'Jornalismo'
    },
    {
      id: '2', 
      tipo: 'freeze',
      nivel: 'A',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      duracao: 45,
      validada: null,
      programa: 'Novela das 9',
      categoria: 'Dramaturgia'
    },
    {
      id: '3',
      tipo: 'lipsync',
      nivel: 'C',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      duracao: 3,
      validada: false,
      programa: 'Programa do Faustão',
      categoria: 'Variedades'
    },
    {
      id: '4',
      tipo: 'corte',
      nivel: 'X',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      duracao: 120,
      validada: true,
      programa: 'Fantástico',
      categoria: 'Variedades'
    },
    {
      id: '5',
      tipo: 'fade',
      nivel: 'B',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      duracao: 15,
      validada: null,
      programa: 'Globo Esporte',
      categoria: 'Esportes'
    },
  // 🔽 Novas ocorrências adicionadas abaixo (IDs 6 a 12)
  {
    id: '6',
    tipo: 'tela_escura',
    nivel: 'C',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    duracao: 5,
    validada: null,
    programa: 'Jornal Hoje',
    categoria: 'Jornalismo'
  },
  {
    id: '7',
    tipo: 'freeze',
    nivel: 'B',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    duracao: 30,
    validada: true,
    programa: 'Malhação',
    categoria: 'Dramaturgia'
  },
  {
    id: '8',
    tipo: 'lipsync',
    nivel: 'A',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    duracao: 12,
    validada: false,
    programa: 'The Voice Brasil',
    categoria: 'Musical'
  },
  {
    id: '9',
    tipo: 'fade',
    nivel: 'C',
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    duracao: 10,
    validada: null,
    programa: 'Esporte Espetacular',
    categoria: 'Esportes'
  },
  {
    id: '10',
    tipo: 'imagem_errada',
    nivel: 'X',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    duracao: 22,
    validada: true,
    programa: 'Domingão com Huck',
    categoria: 'Variedades'
  },
  {
    id: '11',
    tipo: 'reporter_parado',
    nivel: 'B',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    duracao: 6,
    validada: null,
    programa: 'Globo Reporter',
    categoria: 'Jornalismo'
  },
  {
    id: '12',
    tipo: 'variacao_pixels',
    nivel: 'C',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    duracao: 4,
    validada: true,
    programa: 'Detetives do Prédio Azul',
    categoria: 'Infantil'
  }
  ]);

  // Função para filtrar ocorrências
  const ocorrenciasFiltradas = ocorrencias.filter(ocorrencia => {
    const textoMatch = !filtroTexto || 
      ocorrencia.tipo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      ocorrencia.id.includes(filtroTexto) ||
      ocorrencia.programa?.toLowerCase().includes(filtroTexto.toLowerCase());
    
    const nivelMatch = filtroNivel === 'todos' || ocorrencia.nivel === filtroNivel;
    const tipoMatch = filtroTipo === 'todos' || ocorrencia.tipo === filtroTipo;
    const categoriaMatch = filtroCategoria === 'todos' || ocorrencia.categoria === filtroCategoria;
    const programaMatch = filtroPrograma === 'todos' || ocorrencia.programa === filtroPrograma;
    
    let statusMatch = true;
    if (filtroStatus === 'nao_analisadas') statusMatch = ocorrencia.validada === null;
    else if (filtroStatus === 'confirmadas') statusMatch = ocorrencia.validada === true;
    else if (filtroStatus === 'falsos_positivos') statusMatch = ocorrencia.validada === false;
    
    return textoMatch && nivelMatch && statusMatch && tipoMatch && 
           categoriaMatch && programaMatch;
  });

  // Calcular ocorrências da página atual
  const indiceInicial = (paginaAtual - 1) * ocorrenciasPorPagina;
  const indiceFinal = indiceInicial + ocorrenciasPorPagina;
  const ocorrenciasPagina = ocorrenciasFiltradas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ocorrenciasFiltradas.length / ocorrenciasPorPagina);

  // Função para abrir modal de detalhes
  const abrirDetalhes = (ocorrencia: Ocorrencia) => {
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
      'C': 'bg-nivel-c text-white',
      'B': 'bg-nivel-b text-white', 
      'A': 'bg-nivel-a text-white',
      'X': 'bg-nivel-x text-white'
    };
    return cores[nivel as keyof typeof cores] || 'bg-muted';
  };

  // Função para obter ícone de status
  const obterIconeStatus = (validada: boolean | null) => {
    if (validada === null) return { icon: Eye, color: 'text-muted-foreground', texto: 'Não analisada' };
    if (validada === true) return { icon: CheckCircle, color: 'text-red-500', texto: 'Confirmada' };
    return { icon: XCircle, color: 'text-green-500', texto: 'Falso positivo' };
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Todas as Ocorrências
          </h1>
          <p className="text-muted-foreground">
            Gerencie e analise todas as ocorrências detectadas pelo sistema de IA
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Busca por texto */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por tipo ou ID..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por nível */}
              <Select value={filtroNivel} onValueChange={setFiltroNivel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Níveis</SelectItem>
                  <SelectItem value="C">Nível C - Leve</SelectItem>
                  <SelectItem value="B">Nível B - Médio</SelectItem>
                  <SelectItem value="A">Nível A - Grave</SelectItem>
                  <SelectItem value="X">Nível X - Gravíssimo</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por status */}
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="nao_analisadas">Não Analisadas</SelectItem>
                  <SelectItem value="confirmadas">Confirmadas</SelectItem>
                  <SelectItem value="falsos_positivos">Falsos Positivos</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por tipo */}
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="tela_escura">Tela Escura</SelectItem>
                  <SelectItem value="freeze">Tela Congelada</SelectItem>
                  <SelectItem value="lipsync">Lipsync Desalinhado</SelectItem>
                  <SelectItem value="corte">Corte no Programa</SelectItem>
                  <SelectItem value="fade">Fade Inesperado</SelectItem>
                  <SelectItem value="imagem_errada">Imagem Errada</SelectItem>
                  <SelectItem value="reporter_parado">Reporter Parado</SelectItem>
                  <SelectItem value="variacao_pixels">Variação de Pixels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segunda linha de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por categoria */}
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  <SelectItem value="Jornalismo">Jornalismo</SelectItem>
                  <SelectItem value="Dramaturgia">Dramaturgia</SelectItem>
                  <SelectItem value="Variedades">Variedades</SelectItem>
                  <SelectItem value="Esportes">Esportes</SelectItem>
                  <SelectItem value="Musical">Musical</SelectItem>
                  <SelectItem value="Infantil">Infantil</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por programa */}
              <Select value={filtroPrograma} onValueChange={setFiltroPrograma}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Programas</SelectItem>
                  <SelectItem value="Jornal Nacional">Jornal Nacional</SelectItem>
                  <SelectItem value="Novela das 9">Novela das 9</SelectItem>
                  <SelectItem value="Programa do Faustão">Programa do Faustão</SelectItem>
                  <SelectItem value="Fantástico">Fantástico</SelectItem>
                  <SelectItem value="Globo Esporte">Globo Esporte</SelectItem>
                </SelectContent>
              </Select>

              {/* Botão limpar filtros */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiltroTexto('');
                  setFiltroNivel('todos');
                  setFiltroStatus('todos');
                  setFiltroTipo('todos');
                  setFiltroCategoria('todos');
                  setFiltroPrograma('todos');
                  setPaginaAtual(1);
                }}
                className="mt-6"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {ocorrencias.length}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {ocorrencias.filter(o => o.validada === null).length}
            </div>
            <div className="text-sm text-muted-foreground">Não Analisadas</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {ocorrencias.filter(o => o.validada === true).length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmadas</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {ocorrencias.filter(o => o.validada === false).length}
            </div>
            <div className="text-sm text-muted-foreground">Falsos Positivos</div>
          </Card>
        </div>

        {/* Lista de ocorrências */}
        <Card className="bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <div className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">
              Ocorrências Encontradas ({ocorrenciasFiltradas.length}) - Página {paginaAtual} de {totalPaginas}
            </h3>
            
            {ocorrenciasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma ocorrência encontrada com os filtros aplicados
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ocorrenciasPagina.map((ocorrencia) => {
                  const status = obterIconeStatus(ocorrencia.validada);
                  const StatusIcon = status.icon;

                  return (
                    <Card
                      key={ocorrencia.id}
                      className="p-4 hover:bg-accent/50 cursor-pointer transition-all"
                      onClick={() => abrirDetalhes(ocorrencia)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={`${obterCorNivel(ocorrencia.nivel)} text-xs font-semibold`}>
                            Nível {ocorrencia.nivel}
                          </Badge>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium text-foreground">
                              {formatarTipoOcorrencia(ocorrencia.tipo)}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(ocorrencia.timestamp).toLocaleString('pt-BR')}
                              </span>
                              <span>Duração: {ocorrencia.duracao}s</span>
                              <span>ID: {ocorrencia.id}</span>
                            </div>
                            {/* Informações adicionais */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              {ocorrencia.programa && (
                                <span>Programa: {ocorrencia.programa}</span>
                              )}
                              {ocorrencia.categoria && (
                                <span>Categoria: {ocorrencia.categoria}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-xs ${status.color}`}>
                              {status.texto}
                            </span>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {paginaAtual > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPaginaAtual(paginaAtual - 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
                      <PaginationItem key={numeroPagina}>
                        <PaginationLink
                          href="#"
                          isActive={numeroPagina === paginaAtual}
                          onClick={(e) => {
                            e.preventDefault();
                            setPaginaAtual(numeroPagina);
                          }}
                        >
                          {numeroPagina}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {paginaAtual < totalPaginas && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPaginaAtual(paginaAtual + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de detalhes */}
      <ModalDetalhesOcorrencia
        ocorrencia={ocorrenciaSelecionada}
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoValidar={validarOcorrencia}
      />
    </div>
  );
};

export default Ocorrencias;
