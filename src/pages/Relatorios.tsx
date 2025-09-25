import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Relatorios: React.FC = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal');

  // Dados simulados para demonstração
  const dadosOcorrenciasPorDia = [
    { dia: '01/01', nivel_c: 2, nivel_b: 1, nivel_a: 0, nivel_x: 0 },
    { dia: '02/01', nivel_c: 3, nivel_b: 2, nivel_a: 1, nivel_x: 0 },
    { dia: '03/01', nivel_c: 1, nivel_b: 3, nivel_a: 0, nivel_x: 1 },
    { dia: '04/01', nivel_c: 4, nivel_b: 1, nivel_a: 2, nivel_x: 0 },
    { dia: '05/01', nivel_c: 2, nivel_b: 2, nivel_a: 1, nivel_x: 0 },
    { dia: '06/01', nivel_c: 1, nivel_b: 1, nivel_a: 0, nivel_x: 0 },
    { dia: '07/01', nivel_c: 3, nivel_b: 0, nivel_a: 1, nivel_x: 0 }
  ];

  const dadosTiposOcorrencia = [
    { tipo: 'Tela Escura', quantidade: 15, cor: '#8884d8' },
    { tipo: 'Freeze', quantidade: 12, cor: '#82ca9d' },
    { tipo: 'Lipsync', quantidade: 8, cor: '#ffc658' },
    { tipo: 'Corte', quantidade: 5, cor: '#ff7c7c' },
    { tipo: 'Outros', quantidade: 3, cor: '#8dd1e1' }
  ];

  const dadosTendencias = [
    { mes: 'Set', ocorrencias: 45 },
    { mes: 'Out', ocorrencias: 52 },
    { mes: 'Nov', ocorrencias: 38 },
    { mes: 'Dez', ocorrencias: 41 },
    { mes: 'Jan', ocorrencias: 43 }
  ];

  const estatisticasGerais = {
    totalOcorrencias: 156,
    ocorrenciasConfirmadas: 89,
    falsosPosivivos: 34,
    naoAnalisadas: 33,
    tempoMedioResposta: '2.3 min',
    maiorIncidente: '15 min',
    disponibilidadeServico: '99.2%'
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Relatórios e Dashboards
            </h1>
            <p className="text-muted-foreground">
              Análises estatísticas e tendências do sistema de monitoramento
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Últimos 7 dias</SelectItem>
                <SelectItem value="semanal">Últimas 4 semanas</SelectItem>
                <SelectItem value="mensal">Últimos 12 meses</SelectItem>
                <SelectItem value="anual">Últimos 3 anos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Ocorrências</p>
                <p className="text-3xl font-bold text-foreground">
                  {estatisticasGerais.totalOcorrencias}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  -12% vs mês anterior
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-3xl font-bold text-red-500">
                  {estatisticasGerais.ocorrenciasConfirmadas}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((estatisticasGerais.ocorrenciasConfirmadas / estatisticasGerais.totalOcorrencias) * 100).toFixed(1)}% do total
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-red-500/60" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Falsos Positivos</p>
                <p className="text-3xl font-bold text-green-500">
                  {estatisticasGerais.falsosPosivivos}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((estatisticasGerais.falsosPosivivos / estatisticasGerais.totalOcorrencias) * 100).toFixed(1)}% do total
                </p>
              </div>
              <XCircle className="h-12 w-12 text-green-500/60" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibilidade</p>
                <p className="text-3xl font-bold text-primary">
                  {estatisticasGerais.disponibilidadeServico}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.1% vs mês anterior
                </p>
              </div>
              <Clock className="h-12 w-12 text-primary/60" />
            </div>
          </Card>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de ocorrências por dia */}
          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Ocorrências por Dia (Últimos 7 dias)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosOcorrenciasPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="dia" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="nivel_c" stackId="a" fill="hsl(var(--nivel-c))" name="Nível C" />
                <Bar dataKey="nivel_b" stackId="a" fill="hsl(var(--nivel-b))" name="Nível B" />
                <Bar dataKey="nivel_a" stackId="a" fill="hsl(var(--nivel-a))" name="Nível A" />
                <Bar dataKey="nivel_x" stackId="a" fill="hsl(var(--nivel-x))" name="Nível X" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de tipos de ocorrência */}
          <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Distribuição por Tipo de Ocorrência
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosTiposOcorrencia}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="quantidade"
                  label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                >
                  {dadosTiposOcorrencia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Gráfico de tendências */}
        <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Tendência de Ocorrências (Últimos 5 meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosTendencias}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="ocorrencias" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Resumo por níveis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center bg-gradient-to-br from-nivel-c/20 to-nivel-c/10 border-nivel-c/30">
            <Badge className="bg-nivel-c text-white mb-2">Nível C</Badge>
            <div className="text-2xl font-bold text-foreground">68</div>
            <div className="text-sm text-muted-foreground">Ocorrências Leves</div>
            <div className="text-xs text-muted-foreground mt-1">≤ 4 segundos</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-nivel-b/20 to-nivel-b/10 border-nivel-b/30">
            <Badge className="bg-nivel-b text-white mb-2">Nível B</Badge>
            <div className="text-2xl font-bold text-foreground">42</div>
            <div className="text-sm text-muted-foreground">Ocorrências Médias</div>
            <div className="text-xs text-muted-foreground mt-1">≤ 9 segundos</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-nivel-a/20 to-nivel-a/10 border-nivel-a/30">
            <Badge className="bg-nivel-a text-white mb-2">Nível A</Badge>
            <div className="text-2xl font-bold text-foreground">28</div>
            <div className="text-sm text-muted-foreground">Ocorrências Graves</div>
            <div className="text-xs text-muted-foreground mt-1">≤ 59 segundos</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-nivel-x/20 to-nivel-x/10 border-nivel-x/30">
            <Badge className="bg-nivel-x text-white mb-2">Nível X</Badge>
            <div className="text-2xl font-bold text-foreground">18</div>
            <div className="text-sm text-muted-foreground">Ocorrências Gravíssimas</div>
            <div className="text-xs text-muted-foreground mt-1">≥ 60 segundos</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;