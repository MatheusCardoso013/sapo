import { useState } from 'react';
import {
  Ship, Star, MessageSquare, Menu, Bell, Search,
  TrendingUp, LogOut, FileText, PlusCircle, Users, UserCheck
} from 'lucide-react';

import { useAppData } from './hooks/useAppData';
import { NavItem } from './components/NavItem';
import { DashboardContent } from './pages/Dashboard';
import { ReportsContent } from './pages/Reports';
import { TerminalsContent } from './pages/Terminals';
import { TerminalAvaliacoesContent } from './pages/TerminalAvaliacoes';
import { ServicoAvaliacoesContent } from './pages/ServicoAvaliacoes';
import { PublicCommentsContent } from './pages/PublicComments';
import { CreateCommentContent } from './pages/CreateComment';
import { LoginScreen, RegisterScreen, type Role } from './pages/Auth';
import { TeamContent } from './pages/Team';
import { UsersContent } from './pages/Users';

type View = 'login' | 'register' | 'app';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<Role>('cliente');
  const [userName, setUserName] = useState('');
  const { data, loading } = useAppData();

  const handleLogin = ({ role: r, userName: n }: { view: 'app'; role: Role; userName: string }) => {
    setRole(r);
    setUserName(n);
    setActiveTab('dashboard');
    setView('app');
  };

  const handleLogout = () => {
    setView('login');
    setActiveTab('dashboard');
  };

  if (view === 'login') return <LoginScreen onLogin={handleLogin} onNavigate={() => setView('register')} />;
  if (view === 'register') return <RegisterScreen onLogin={handleLogin} onNavigate={() => setView('login')} />;

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans">
        <div className="text-xl font-medium text-gray-600 flex items-center gap-3">
          <span className="text-3xl animate-bounce">🐸</span> Carregando banco de dados local...
        </div>
      </div>
    );
  }

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const subtitle = role === 'superadmin' ? 'Super Admin' : 'Cliente';

  return (
    <div className="h-screen bg-port-gray flex font-sans overflow-hidden">
      <aside className={`bg-port-blue text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col h-full z-20 flex-shrink-0`}>
        <div className="p-4 flex items-center justify-between h-16 border-b border-blue-800">
          {sidebarOpen && <span className="font-bold text-lg truncate flex items-center gap-2"><span className="text-2xl">🐸</span> Sapo</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-blue-800 rounded">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<TrendingUp />} label="Dashboard" active={activeTab === 'dashboard'} open={sidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<FileText />} label="Relatórios e Serviços" active={activeTab === 'reports'} open={sidebarOpen} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<Ship />} label="Terminais" active={activeTab === 'terminals'} open={sidebarOpen} onClick={() => setActiveTab('terminals')} />
          <NavItem icon={<Star />} label="Aval. de Terminal" active={activeTab === 'aval-terminal'} open={sidebarOpen} onClick={() => setActiveTab('aval-terminal')} />
          <NavItem icon={<Star />} label="Aval. de Serviço" active={activeTab === 'aval-servico'} open={sidebarOpen} onClick={() => setActiveTab('aval-servico')} />
          <NavItem icon={<MessageSquare />} label="Comentários Públicos" active={activeTab === 'public-comments'} open={sidebarOpen} onClick={() => setActiveTab('public-comments')} />
          <NavItem icon={<PlusCircle />} label="Criar Comentário" active={activeTab === 'create-comment'} open={sidebarOpen} onClick={() => setActiveTab('create-comment')} />

          {role === 'superadmin' && (
            <>
              <div className={`border-t border-blue-700 my-2 ${sidebarOpen ? 'mx-0' : 'mx-1'}`} />
              <NavItem icon={<UserCheck />} label="Equipe" active={activeTab === 'team'} open={sidebarOpen} onClick={() => setActiveTab('team')} />
              <NavItem icon={<Users />} label="Usuários Cadastrados" active={activeTab === 'users'} open={sidebarOpen} onClick={() => setActiveTab('users')} />
            </>
          )}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <NavItem icon={<LogOut />} label="Sair" open={sidebarOpen} onClick={handleLogout} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 relative">
            <Search size={18} className="text-gray-400 absolute left-3" />
            <input type="text" placeholder="Buscar terminais, navios ou relatórios..."
              className="bg-transparent border-none outline-none w-full pl-8 text-sm text-gray-700" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {subtitle}
                  </span>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border shadow-sm text-sm ${role === 'superadmin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
                {initials}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-port-gray relative">
          {activeTab === 'dashboard' && <DashboardContent data={data} />}
          {activeTab === 'reports' && <ReportsContent data={data} role={role} />}
          {activeTab === 'terminals' && <TerminalsContent />}
          {activeTab === 'create-comment' && <CreateCommentContent />}
          {activeTab === 'public-comments' && <PublicCommentsContent />}
          {activeTab === 'aval-terminal' && <TerminalAvaliacoesContent />}
          {activeTab === 'aval-servico' && <ServicoAvaliacoesContent />}
          {activeTab === 'team' && role === 'superadmin' && <TeamContent />}
          {activeTab === 'users' && role === 'superadmin' && <UsersContent />}
        </div>
      </main>
    </div>
  );
}

export default App;
