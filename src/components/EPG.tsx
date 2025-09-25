import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Tv, Calendar } from 'lucide-react';

interface Programa {
  id: string;
  nome: string;
  horarioInicio: string;
  horarioFim: string;
  categoria: string;
  ativo: boolean;
}

const EPG: React.FC = () => {
  const [dataHoraAtual, setDataHoraAtual] = useState(new Date());
  const [programas, setProgramas] = useState<Programa[]>([]);

  // Atualiza data/hora a cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDataHoraAtual(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Simulação de dados de EPG - substituir por dados reais da API
  useEffect(() => {
    const agora = new Date();
    const programasSimulados: Programa[] = [
      {
        id: '1',
        nome: 'Jornal Nacional',
        horarioInicio: new Date(agora.getTime() - 30 * 60000).toISOString(), // 30 min atrás
        horarioFim: new Date(agora.getTime() + 30 * 60000).toISOString(), // +30 min
        categoria: 'Jornalismo',
        ativo: true
      },
      {
        id: '2', 
        nome: 'Novela das 9',
        horarioInicio: new Date(agora.getTime() + 30 * 60000).toISOString(), // +30 min
        horarioFim: new Date(agora.getTime() + 90 * 60000).toISOString(), // +90 min
        categoria: 'Dramaturgia',
        ativo: false
      },
      {
        id: '3',
        nome: 'Programa do Faustão',
        horarioInicio: new Date(agora.getTime() + 90 * 60000).toISOString(), // +90 min
        horarioFim: new Date(agora.getTime() + 180 * 60000).toISOString(), // +180 min
        categoria: 'Variedades',
        ativo: false
      }
    ];

    setProgramas(programasSimulados);
  }, []);

  const formatarDataHora = (data: Date) => {
    return data.toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatarHorario = (horario: string) => {
    return new Date(horario).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const programaAtual = programas.find(p => p.ativo);
  const proximosProgramas = programas.filter(p => !p.ativo).slice(0, 2);

  return (
    <Card className="p-6 bg-gradient-to-br from-broadcast-secondary to-broadcast-accent">
      <div className="space-y-6">
        {/* Data e Hora Atual */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Data e Hora Atual
          </h3>
          <div className="text-sm text-muted-foreground">
            {formatarDataHora(dataHoraAtual)}
          </div>
        </div>

        {/* Programa Atual */}
        {programaAtual && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Tv className="h-5 w-5 text-red-500" />
              No Ar Agora
            </h4>
            <Card className="p-4 bg-background/50 border-l-4 border-l-red-500">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">
                    {programaAtual.nome}
                  </h5>
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    AO VIVO
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatarHorario(programaAtual.horarioInicio)} - {formatarHorario(programaAtual.horarioFim)}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-md">
                    {programaAtual.categoria}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Próximos Programas */}
        {proximosProgramas.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Programas
            </h4>
            <div className="space-y-2">
              {proximosProgramas.map((programa, index) => (
                <Card key={programa.id} className="p-3 bg-background/30">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h6 className="text-sm font-medium text-foreground">
                        {programa.nome}
                      </h6>
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? 'Próximo' : 'Em seguida'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatarHorario(programa.horarioInicio)} - {formatarHorario(programa.horarioFim)}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md">
                        {programa.categoria}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EPG;