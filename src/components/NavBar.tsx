import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  List, 
  BarChart3, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const itensMenu = [
    {
      id: 'principal',
      label: 'Monitor ao Vivo',
      icon: Monitor,
      path: '/',
      descricao: 'Monitoramento em tempo real'
    },
    {
      id: 'ocorrencias',
      label: 'Todas Ocorrências', 
      icon: List,
      path: '/ocorrencias',
      descricao: 'Histórico completo'
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: BarChart3,
      path: '/relatorios',
      descricao: 'Dashboards e estatísticas'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      path: '/configuracoes',
      descricao: 'Link SRT e preferências'
    }
  ];

  const navegar = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-gradient-to-r from-broadcast-secondary to-broadcast-accent border-b border-border shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
               
               <div className="relative">
              <img 
                src="/globo.png" 
                alt="Rede Globo" 
                className="h-8 w-8 object-contain" 
              />
            </div>

              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Rede Globo Nordeste
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sistema de Monitoramento Inteligente
                </p>
              </div>
            </div>
          </div>

          {/* Menu de navegação */}
          <div className="flex items-center space-x-2">
            {itensMenu.map((item) => {
              const Icon = item.icon;
              const ativo = location.pathname === item.path;
              
              return (
                <Button
                  key={item.id}
                  variant={ativo ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navegar(item.path)}
                  className={`
                    flex items-center space-x-2 transition-all duration-200
                    ${ativo 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline text-sm">
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Status da conexão */}
          <div className="flex items-center space-x-4">
            {/* Indicador de status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground hidden lg:inline">
                Sistema Ativo
              </span>
            </div>

            {/* Contador de ocorrências (simulado) */}
            <div className="flex items-center space-x-1 px-3 py-1 bg-accent rounded-full">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-foreground font-medium">
                0
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;