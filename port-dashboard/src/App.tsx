import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Ship, Clock, Star, MessageSquare, Menu, Bell, Search, Anchor,
  TrendingUp, TrendingDown, MoreVertical, LogOut, FileText, PlusCircle
} from 'lucide-react';

function useAppData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/waitTimeData').then(res => res.json()),
      fetch('http://localhost:3001/terminalRankingData').then(res => res.json()),
      fetch('http://localhost:3001/cargoData').then(res => res.json()),
      fetch('http://localhost:3001/recentReviews').then(res => res.json()),
      fetch('http://localhost:3001/portServicesData').then(res => res.json())
    ]).then(([waitTimeData, terminalRankingData, cargoData, recentReviews, portServicesData]) => {
      setData({ waitTimeData, terminalRankingData, cargoData, recentReviews, portServicesData });
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch mock data:", error);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'login' | 'register' | 'app'>('app');
  const { data, loading } = useAppData();

  if (view === 'login') {
    return <LoginScreen onNavigate={setView} />;
  }

  if (view === 'register') {
    return <RegisterScreen onNavigate={setView} />;
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans">
        <div className="text-xl font-medium text-gray-600 flex items-center gap-3">
          <span className="text-3xl animate-bounce">🐸</span> Carregando banco de dados local...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-port-gray flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-port-blue text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col h-full z-20 flex-shrink-0`}>
        <div className="p-4 flex items-center justify-between h-16 border-b border-blue-800">
          {sidebarOpen && <span className="font-bold text-lg truncate flex items-center gap-2"><span className="text-2xl">🐸</span> Sapo</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-blue-800 rounded">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<TrendingUp />}
            label="Dashboard Principal"
            active={activeTab === 'dashboard'}
            open={sidebarOpen}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem
            icon={<FileText />}
            label="Relatórios e Serviços"
            active={activeTab === 'reports'}
            open={sidebarOpen}
            onClick={() => setActiveTab('reports')}
          />
          <NavItem
            icon={<Ship />}
            label="Terminais"
            active={activeTab === 'terminals'}
            open={sidebarOpen}
            onClick={() => setActiveTab('terminals')}
          />
          <NavItem icon={<Star />} label="Aval. de Terminal" active={activeTab === 'aval-terminal'} open={sidebarOpen} onClick={() => setActiveTab('aval-terminal')} />
          <NavItem icon={<Star />} label="Aval. de Serviço" active={activeTab === 'aval-servico'} open={sidebarOpen} onClick={() => setActiveTab('aval-servico')} />
          <NavItem icon={<MessageSquare />} label="Comentários Públicos" active={activeTab === 'public-comments'} open={sidebarOpen} onClick={() => setActiveTab('public-comments')} />
          <NavItem icon={<PlusCircle />} label="Criar Comentário" active={activeTab === 'create-comment'} open={sidebarOpen} onClick={() => setActiveTab('create-comment')} />
        </nav>
        <div className="p-4 border-t border-blue-800">
          <NavItem icon={<LogOut />} label="Sair" open={sidebarOpen} onClick={() => setView('login')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 relative">
            <Search size={18} className="text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Buscar terminais, navios ou relatórios..."
              className="bg-transparent border-none outline-none w-full pl-8 text-sm text-gray-700"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">Admin Silva</p>
                <p className="text-xs text-gray-500">Gestor de Operações</p>
              </div>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                AS
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-port-gray relative">
          {activeTab === 'dashboard' && <DashboardContent data={data} />}
          {activeTab === 'reports' && <ReportsContent data={data} />}
          {activeTab === 'terminals' && <TerminalsContent />}
          {activeTab === 'create-comment' && <CreateCommentContent />}
          {activeTab === 'public-comments' && <PublicCommentsContent />}
          {activeTab === 'aval-terminal' && <TerminalAvaliacoesContent />}
          {activeTab === 'aval-servico' && <ServicoAvaliacoesContent />}
        </div>
      </main>
    </div>
  );
}

const COLORS = ['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B'];

function DashboardContent({ data }: { data: any }) {
  const { terminalRankingData = [], recentReviews = [] } = data || {};

  // Assume reviews without type are "Avaliação"
  const enrichedReviews = recentReviews?.map((r: any) => ({
    ...r,
    type: r.type || 'Avaliação'
  }));

  const criticas = enrichedReviews.filter((r: any) => r.type === 'Crítica');
  const outrasAvaliacoes = enrichedReviews.filter((r: any) => r.type !== 'Crítica');

  const ReviewItem = ({ review }: { review: any }) => (
    <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50 group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold text-sm text-gray-800">{review.user}</span>
          <span className="text-xs text-gray-500 ml-2 bg-gray-200 px-2 py-0.5 rounded-full">{review.terminal}</span>
        </div>
        <div className="flex items-center gap-1">
          {review.rating ? (
            <span className="text-xs font-bold text-yellow-600 flex items-center gap-1">
              <Star size={12} className="fill-current" /> {review.rating}/10
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
              {review.type}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2 leading-relaxed">&quot;{review.comment}&quot;</p>
      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
        <span>{review.time}</span>
        {review.service && <span className="text-port-accent font-medium truncate max-w-[120px]">{review.service}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-8 lg:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[180px]">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Bem-vindo ao SAPO 👋</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Sistema de Avaliação Portuária. Acompanhe o ranking de terminais e o sentimento real da operação
            através das avaliações e críticas mais recentes.
          </p>
        </div>
        <Anchor className="absolute right-[-20px] bottom-[-40px] text-white opacity-10" size={240} strokeWidth={1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Ranking */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-800 text-lg">Resumo de Terminais</h2>
            <button className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Ver todos</button>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terminalRankingData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide domain={[0, 10]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="score" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={24}>
                  {terminalRankingData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 9 ? '#10B981' : entry.score >= 8 ? '#3B82F6' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avaliações e Feedbacks Recentes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-800 text-lg flex items-center gap-2">⭐ Avaliações Recentes</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {outrasAvaliacoes.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {outrasAvaliacoes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-10">Nenhuma avaliação recente.</p>
            )}
          </div>
        </div>

        {/* Críticas Recentes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-800 text-lg flex items-center gap-2">⚠️ Críticas Recentes</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {criticas.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {criticas.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-10">Nenhuma crítica recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsContent({ data }: { data: any }) {
  const terminalReports = [
    { id: 't1', name: 'Santos Brasil', status: 'Operacional', requests: 312, avgResponseTime: '18 min', satisfaction: 9.2 },
    { id: 't2', name: 'Terminal STS10', status: 'Operacional', requests: 204, avgResponseTime: '22 min', satisfaction: 8.7 },
    { id: 't3', name: 'Brasil Terminal Portuário (BTP)', status: 'Alta Demanda', requests: 178, avgResponseTime: '40 min', satisfaction: 8.4 },
    { id: 't4', name: 'DP World Santos', status: 'Alta Demanda', requests: 145, avgResponseTime: '35 min', satisfaction: 7.9 },
    { id: 't5', name: 'Rumo Logística', status: 'Operacional', requests: 98, avgResponseTime: '12 min', satisfaction: 9.5 },
    { id: 't6', name: 'Ecoporto Santos', status: 'Manutenção', requests: 20, avgResponseTime: '—', satisfaction: 6.3 },
    { id: 't7', name: 'Copersucar', status: 'Operacional', requests: 55, avgResponseTime: '20 min', satisfaction: 8.1 },
    { id: 't8', name: 'Cutrale', status: 'Operacional', requests: 42, avgResponseTime: '15 min', satisfaction: 8.8 },
  ];

  const initialServiceReports = [
    { id: 's1', name: 'Praticagem', status: 'Operacional', requests: 145, avgResponseTime: '15 min', satisfaction: 9.8, evaluations: 120, terminal: 'Santos Brasil', month: 'Dezembro' },
    { id: 's2', name: 'Rebocadores', status: 'Alta Demanda', requests: 89, avgResponseTime: '25 min', satisfaction: 9.0, evaluations: 85, terminal: 'DP World Santos', month: 'Novembro' },
    { id: 's3', name: 'Fornecimento de Combustível', status: 'Operacional', requests: 34, avgResponseTime: '2 h', satisfaction: 8.4, evaluations: 40, terminal: 'Terminal STS10', month: 'Dezembro' },
    { id: 's4', name: 'Coleta de Resíduos', status: 'Manutenção', requests: 12, avgResponseTime: '4 h', satisfaction: 7.6, evaluations: 15, terminal: 'Ecoporto Santos', month: 'Outubro' },
    { id: 's5', name: 'Inspeção Sanitária', status: 'Operacional', requests: 56, avgResponseTime: '45 min', satisfaction: 9.4, evaluations: 50, terminal: 'Copersucar', month: 'Dezembro' },
  ];

  const [serviceReports, setServiceReports] = React.useState(initialServiceReports);
  const [section, setSection] = React.useState<'services' | 'terminals'>('services');
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterTerminal, setFilterTerminal] = React.useState('');
  const [filterMinEvals, setFilterMinEvals] = React.useState('');
  const [filterMinScore, setFilterMinScore] = React.useState('');
  const [filterMonth, setFilterMonth] = React.useState('');
  const [selected, setSelected] = React.useState<any | null>(null);

  // Modal de Relatório
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [reportTerminal, setReportTerminal] = React.useState('');
  const [reportService, setReportService] = React.useState('');
  const [reportMonth, setReportMonth] = React.useState('');
  const [generatedReportText, setGeneratedReportText] = React.useState('');

  const generateReport = () => {
    if (!reportTerminal || !reportService) {
      alert('Selecione um terminal e um serviço para gerar o relatório.');
      return;
    }

    const { recentReviews = [] } = data || {};
    const filteredReviews = recentReviews.filter((r: any) =>
      r.terminal === reportTerminal && r.service === reportService
    );

    const total = filteredReviews.length;
    let elogios = 0;
    let criticas = 0;
    let sumScore = 0;
    let countRating = 0;

    filteredReviews.forEach((r: any) => {
      if (r.type === 'Elogio' || (r.rating && r.rating >= 8)) elogios++;
      else if (r.type === 'Crítica' || (r.rating && r.rating <= 5)) criticas++;

      if (r.rating !== undefined && r.rating !== null) {
        sumScore += Number(r.rating);
        countRating++;
      }
    });

    const avgScore = countRating > 0 ? (sumScore / countRating).toFixed(1) : 'N/A';

    let resumo = '';
    if (total === 0) {
      resumo = 'não há comentários suficientes para uma análise detalhada deste período.';
    } else if (elogios >= criticas && elogios > 0) {
      resumo = 'a maioria dos usuários está satisfeita com a agilidade e o profissionalismo na operação, destacando o bom desempenho da equipe.';
    } else if (criticas > elogios) {
      resumo = 'existem pontos de atenção urgentes, especialmente com reclamações de lentidão e falhas no fluxo que precisam ser revisadas.';
    } else {
      resumo = 'as opiniões estão divididas, indicando um serviço regular, mas com bastante espaço para melhorias no atendimento e infraestrutura.';
    }

    const monthText = reportMonth ? ` no mês de **${reportMonth}**` : '';
    const reportText = `O terminal **${reportTerminal}**, na área de **${reportService}**, obteve um total de **${total} avaliações** recentes${monthText}. Destas, foram registrados **${elogios} elogios** e **${criticas} críticas**. A nota média alcançada foi de **${avgScore}/10**. Em resumo, a análise dos comentários indica que ${resumo}`;

    setGeneratedReportText(reportText);
  };

  const statusOptions = ['Operacional', 'Alta Demanda', 'Manutenção'];
  const monthOptions = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const terminalOptions = terminalReports.map(t => t.name);

  const filtered = section === 'terminals'
    ? terminalReports.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchStatus;
    })
    : serviceReports.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || r.status === filterStatus;
      const matchTerminal = !filterTerminal || r.terminal === filterTerminal;
      const matchMonth = !filterMonth || r.month === filterMonth;
      const matchMinEvals = !filterMinEvals || r.evaluations >= Number(filterMinEvals);
      const matchMinScore = !filterMinScore || r.satisfaction >= Number(filterMinScore);
      return matchSearch && matchStatus && matchTerminal && matchMonth && matchMinEvals && matchMinScore;
    });

  const clearFilters = () => {
    setSearch(''); setFilterStatus(''); setFilterTerminal(''); setFilterMinEvals(''); setFilterMinScore(''); setFilterMonth('');
  };

  const handleDeleteService = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      setServiceReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditService = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Abre modal para editar relatório: ${id}`);
  };

  const statusBadge = (s: string) => {
    if (s === 'Operacional') return 'bg-green-100 text-green-800';
    if (s === 'Alta Demanda') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Detail view
  if (selected) {
    const s = selected as any;
    const mockTrend = [80, 95, 88, 102, 120, 110, 98];
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    // Auto-generate report text for this specific terminal/service
    const determineReportData = () => {
      const { recentReviews = [] } = data || {};
      const filteredReviews = recentReviews.filter((r: any) =>
        section === 'terminals' ? r.terminal === s.name : (r.terminal === s.terminal && r.service === s.name)
      );
      const total = filteredReviews.length;
      let elogios = 0, criticas = 0, sumScore = 0, countRating = 0;
      filteredReviews.forEach((r: any) => {
        if (r.type === 'Elogio' || (r.rating && r.rating >= 8)) elogios++;
        else if (r.type === 'Crítica' || (r.rating && r.rating <= 5)) criticas++;
        if (r.rating !== undefined && r.rating !== null) {
          sumScore += Number(r.rating);
          countRating++;
        }
      });
      const avgScore = countRating > 0 ? (sumScore / countRating).toFixed(1) : 'N/A';
      let resumo = '';
      if (total === 0) {
        resumo = 'não há comentários suficientes para uma análise detalhada deste período.';
      } else if (elogios >= criticas && elogios > 0) {
        resumo = 'a maioria dos usuários está satisfeita com a agilidade e o profissionalismo na operação, destacando o bom desempenho da equipe.';
      } else if (criticas > elogios) {
        resumo = 'existem pontos de atenção urgentes, especialmente com reclamações de lentidão e falhas no fluxo que precisam ser revisadas.';
      } else {
        resumo = 'as opiniões estão divididas, indicando um serviço regular, mas com bastante espaço para melhorias no atendimento e infraestrutura.';
      }

      const terminalName = section === 'terminals' ? s.name : s.terminal;
      const serviceName = section === 'services' ? s.name : 'operações gerais';
      return `O terminal **${terminalName}**, na área de **${serviceName}**, obteve um total de **${total} avaliações** recentes. Destas, foram registrados **${elogios} elogios** e **${criticas} críticas**. A nota média alcançada foi de **${avgScore}/10**. Em resumo, a análise dos comentários indica que ${resumo}`;
    };

    const autoReportText = determineReportData();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            ← Voltar
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-700">{s.name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{s.name}</h1>
              <p className="text-gray-500 text-sm mt-1">Relatório Detalhado — Porto de Santos</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(s.status)}`}>{s.status}</span>
          </div>

          {/* Auto Generated Summary */}
          <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-xl relative">
            <h3 className="text-sm font-bold text-blue-800 mb-3 absolute top-[-10px] bg-blue-100 px-3 py-0.5 rounded-full inline-block">✨ Síntese Automática</h3>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pt-2"
              dangerouslySetInnerHTML={{ __html: autoReportText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[{ label: 'Requisições (24h)', val: s.requests }, { label: 'Tempo Médio Resp.', val: s.avgResponseTime }, { label: 'Satisfação Média', val: `${s.satisfaction}/10` }, { label: 'Taxa de Re-chamada', val: '4.2%' }].map(k => (
              <div key={k.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-gray-800">{k.val}</p>
                <p className="text-xs text-gray-500 mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly Trend */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Volume de Requisições — Últimos 7 dias</h2>
            <div className="relative h-32 flex items-end gap-2">
              {mockTrend.map((val, i) => {
                const max = Math.max(...mockTrend);
                const h = (val / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{val}</span>
                    <div className="w-full bg-blue-500 rounded-t-md" style={{ height: `${h}%` }} />
                    <span className="text-xs text-gray-400">{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments in report */}
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-4">Comentários Recentes</h2>
            <div className="space-y-3">
              {[
                { user: 'Carlos Silva', rating: 10, text: 'Excelente desempenho. Operação dentro do prazo.' },
                { user: 'João Pereira', rating: 6, text: 'Atraso no processamento. Equipe reativa, mas lenta.' },
                { user: 'Ana Souza', rating: 8, text: 'Serviço bem organizado. Poderia melhorar comunicação.' },
              ].map((c, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {c.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-800">{c.user}</span>
                      <span className="text-sm font-bold text-yellow-600">★ {c.rating}/10</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios e Serviços</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe métricas detalhadas dos serviços portuários</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setIsReportModalOpen(true); setGeneratedReportText(''); }}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
            ✨ Gerar Texto Descritivo
          </button>
          <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
            <FileText size={18} /> Exportar
          </button>
        </div>
      </div>

      {/* Gerar Relatório Modal/Section */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                ✨ Gerar Relatório Descritivo
              </h2>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">✕</button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <p className="text-sm text-gray-500 mb-6">
                Selecione o terminal e o serviço para gerar uma síntese automática com base nos comentários e avaliações recentes do sistema.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Terminal</label>
                  <select value={reportTerminal} onChange={e => { setReportTerminal(e.target.value); setGeneratedReportText(''); }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                    <option value="">Selecione um terminal</option>
                    {terminalOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Serviço</label>
                  <select value={reportService} onChange={e => { setReportService(e.target.value); setGeneratedReportText(''); }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                    <option value="">Selecione um serviço</option>
                    {[...new Set(serviceReports.map(s => s.name)), 'Praticagem', 'Alfândega', 'Balança', 'Logística', 'Segurança', 'Auditoria'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mês (Opcional)</label>
                  <select value={reportMonth} onChange={e => { setReportMonth(e.target.value); setGeneratedReportText(''); }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                    <option value="">Todos os meses</option>
                    {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button
                  onClick={generateReport}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                  disabled={!reportTerminal || !reportService}
                >
                  Gerar Análise
                </button>
              </div>

              {generatedReportText && (
                <div className="mt-4 p-5 bg-blue-50/50 border border-blue-100 rounded-xl relative">
                  <h3 className="text-sm font-bold text-blue-800 mb-3 absolute top-[-10px] bg-blue-100 px-3 py-0.5 rounded-full inline-block">Resultado do Relatório</h3>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pt-2"
                    dangerouslySetInnerHTML={{
                      __html: generatedReportText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-2">
        {(['services', 'terminals'] as const).map(s => (
          <button key={s} onClick={() => { setSection(s); clearFilters(); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${section === s ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}>
            {s === 'services' ? '🔧 Serviços' : '🏗️ Terminais'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 gap-2 w-full">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={section === 'services' ? 'Buscar serviço...' : 'Buscar terminal...'}
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-full" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
            <option value="">Todos os status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {section === 'services' && (
            <>
              <select value={filterTerminal} onChange={e => setFilterTerminal(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                <option value="">Todos os terminais</option>
                {terminalOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                <option value="">Todos os meses</option>
                {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input type="number" min="0" value={filterMinEvals} onChange={e => setFilterMinEvals(e.target.value)}
                placeholder="Mínimo de avaliações..."
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 w-full" />
              <input type="number" step="0.1" min="0" max="10" value={filterMinScore} onChange={e => setFilterMinScore(e.target.value)}
                placeholder="Nota mínima..."
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 w-full" />
            </>
          )}
        </div>
        <div className="flex justify-between items-center w-full mt-1">
          {(search || filterStatus || filterTerminal || filterMinEvals || filterMinScore || filterMonth) ? (
            <button onClick={clearFilters}
              className="text-xs text-red-500 hover:underline font-medium">Limpar filtros</button>
          ) : <span />}
          <span className="text-sm text-gray-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">{section === 'services' ? 'Serviço' : 'Terminal'}</th>
                {section === 'services' && <th className="px-6 py-4 font-medium">Terminal</th>}
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Requisições (24h)</th>
                {section === 'terminals' && <th className="px-6 py-4 font-medium">Tempo Médio Resp.</th>}
                {section === 'services' && <th className="px-6 py-4 font-medium">Mês</th>}
                <th className="px-6 py-4 font-medium">Nota Média</th>
                {section === 'services' && <th className="px-6 py-4 font-medium">Nº Avaliações</th>}
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item: any) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4"><span className="font-medium text-gray-800">{item.name}</span></td>
                  {section === 'services' && <td className="px-6 py-4 text-gray-600 text-sm">{item.terminal}</td>}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.requests}</td>
                  {section === 'terminals' && <td className="px-6 py-4 text-gray-600">{item.avgResponseTime}</td>}
                  {section === 'services' && <td className="px-6 py-4 text-gray-600 text-sm">{item.month}</td>}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-gray-700 font-medium">{item.satisfaction}</span>
                    </div>
                  </td>
                  {section === 'services' && <td className="px-6 py-4 text-gray-600 font-medium">{item.evaluations}</td>}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelected(item)}
                        className="text-port-accent hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors">Relatório</button>

                      {section === 'services' && (
                        <>
                          <button onClick={(e) => handleEditService(item.id, e)} className="text-gray-600 hover:text-blue-600 text-xs font-medium px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 transition-colors">Editar</button>
                          <button onClick={(e) => handleDeleteService(item.id, e)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors">Excluir</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const RATING_CARD_COLORS = {
  score: (avg: number) => avg >= 9 ? 'text-green-600' : avg >= 7 ? 'text-blue-600' : 'text-red-500',
  bar: (avg: number) => avg >= 9 ? 'bg-green-500' : avg >= 7 ? 'bg-blue-500' : 'bg-red-400',
};

function RatingCard({ name, avg, total, elogios, criticas }: { name: string; avg: number; total: number; elogios: number; criticas: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight pr-2">{name}</h3>
        <span className={`text-2xl font-bold ${RATING_CARD_COLORS.score(avg)}`}>{avg.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div className={`h-2 rounded-full transition-all ${RATING_CARD_COLORS.bar(avg)}`} style={{ width: `${avg * 10}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{total} avaliações</span>
        <span className="flex gap-3">
          <span className="text-green-600">👍 {elogios}</span>
          <span className="text-red-500">👎 {criticas}</span>
        </span>
      </div>
    </div>
  );
}

function TerminalAvaliacoesContent() {
  const terminalRatings = [
    { name: 'Santos Brasil', avg: 9.2, total: 48, elogios: 32, criticas: 4 },
    { name: 'Terminal STS10', avg: 8.7, total: 35, elogios: 25, criticas: 3 },
    { name: 'Brasil Terminal Portuário (BTP)', avg: 8.4, total: 29, elogios: 20, criticas: 5 },
    { name: 'DP World Santos', avg: 7.9, total: 22, elogios: 14, criticas: 6 },
    { name: 'Rumo Logística', avg: 9.5, total: 18, elogios: 16, criticas: 1 },
    { name: 'Ecoporto Santos', avg: 6.3, total: 12, elogios: 5, criticas: 6 },
    { name: 'Copersucar', avg: 8.1, total: 10, elogios: 7, criticas: 2 },
    { name: 'Cutrale', avg: 8.8, total: 9, elogios: 7, criticas: 1 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">🏗️ Avaliação de Terminal</h1>
        <p className="text-gray-500 text-sm mt-1">Média das notas recebidas por cada terminal do Porto de Santos</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {terminalRatings.map(t => <RatingCard key={t.name} {...t} />)}
      </div>
    </div>
  );
}

function ServicoAvaliacoesContent() {
  const allServices = [
    { name: 'Praticagem (pilotagem)', category: 'Apoio à Navegação', avg: 9.4, total: 42, elogios: 35, criticas: 2, terminal: 'Santos Brasil' },
    { name: 'Rebocadores (towage)', category: 'Apoio à Navegação', avg: 8.9, total: 33, elogios: 26, criticas: 3, terminal: 'Santos Brasil' },
    { name: 'Atracação / acostagem', category: 'Apoio à Navegação', avg: 8.5, total: 28, elogios: 20, criticas: 4, terminal: 'Terminal STS10' },
    { name: 'Mooring (amarração)', category: 'Apoio à Navegação', avg: 7.8, total: 18, elogios: 12, criticas: 3, terminal: 'DP World Santos' },
    { name: 'Bunkering (combustível)', category: 'Apoio à Navegação', avg: 7.1, total: 16, elogios: 9, criticas: 5, terminal: 'Cutrale' },
    { name: 'Carga e descarga de mercadorias', category: 'Operacional', avg: 8.2, total: 38, elogios: 28, criticas: 5, terminal: 'Brasil Terminal Portuário (BTP)' },
    { name: 'Manuseio de containers', category: 'Operacional', avg: 8.6, total: 30, elogios: 22, criticas: 3, terminal: 'Santos Brasil' },
    { name: 'Operações de granel sólido', category: 'Operacional', avg: 9.1, total: 24, elogios: 20, criticas: 2, terminal: 'Rumo Logística' },
    { name: 'Operações de granel líquido', category: 'Operacional', avg: 8.3, total: 15, elogios: 11, criticas: 2, terminal: 'Copersucar' },
    { name: 'Ro-ro (roll-on/roll-off)', category: 'Operacional', avg: 8.0, total: 12, elogios: 8, criticas: 2, terminal: 'DP World Santos' },
    { name: 'Armazenagem alfandegada', category: 'Armazenagem & Logística', avg: 7.4, total: 20, elogios: 12, criticas: 5, terminal: 'Ecoporto Santos' },
    { name: 'Logística integrada', category: 'Armazenagem & Logística', avg: 8.6, total: 14, elogios: 11, criticas: 2, terminal: 'Rumo Logística' },
    { name: 'Desembaraço aduaneiro', category: 'Administrativo', avg: 6.8, total: 25, elogios: 10, criticas: 9, terminal: 'Santos Brasil' },
    { name: 'Inspeção sanitária', category: 'Administrativo', avg: 7.6, total: 20, elogios: 12, criticas: 5, terminal: 'Terminal STS10' },
    { name: 'Documentação portuária', category: 'Administrativo', avg: 7.2, total: 17, elogios: 10, criticas: 4, terminal: 'Brasil Terminal Portuário (BTP)' },
    { name: 'Agenciamento marítimo', category: 'Agência Marítima', avg: 8.4, total: 13, elogios: 10, criticas: 2, terminal: 'Santos Brasil' },
    { name: 'Manutenção de estrutura', category: 'Infraestrutura', avg: 7.0, total: 10, elogios: 6, criticas: 3, terminal: 'Ecoporto Santos' },
    { name: 'Monitoramento de navios', category: 'Outros Serviços', avg: 8.9, total: 8, elogios: 7, criticas: 1, terminal: 'Santos Brasil' },
  ];

  const allTerminals = [...new Set(allServices.map(s => s.terminal))];
  const allCategories = [...new Set(allServices.map(s => s.category))];

  const [search, setSearch] = React.useState('');
  const [filterTerminal, setFilterTerminal] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('');

  const filtered = allServices.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchTerminal = !filterTerminal || s.terminal === filterTerminal;
    const matchCategory = !filterCategory || s.category === filterCategory;
    return matchSearch && matchTerminal && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔧 Avaliação de Serviços Portuários</h1>
          <p className="text-gray-500 text-sm mt-1">Média das notas recebidas por serviço</p>
        </div>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          {filtered.length} serviço{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 gap-2 flex-1 min-w-48">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar serviço..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 w-full" />
        </div>
        <select value={filterTerminal} onChange={e => setFilterTerminal(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
          <option value="">Todos os terminais</option>
          {allTerminals.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
          <option value="">Todas as categorias</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || filterTerminal || filterCategory) && (
          <button onClick={() => { setSearch(''); setFilterTerminal(''); setFilterCategory(''); }}
            className="text-xs text-red-500 hover:underline font-medium">
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={36} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{s.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{s.category}</p>
                </div>
                <span className={`text-2xl font-bold ${RATING_CARD_COLORS.score(s.avg)}`}>{s.avg.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Terminal: {s.terminal}</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full ${RATING_CARD_COLORS.bar(s.avg)}`} style={{ width: `${s.avg * 10}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{s.total} avaliações</span>
                <span className="flex gap-3">
                  <span className="text-green-600">👍 {s.elogios}</span>
                  <span className="text-red-500">👎 {s.criticas}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PublicCommentsContent() {
  const mockComments = [
    { id: 1, user: 'Carlos Silva', terminal: 'Santos Brasil', service: 'Praticagem', type: 'Elogio', rating: 10, comment: 'Processo de atracação muito rápido hoje. Equipe extremamente profissional e ágil.', time: '2h atrás', isPublic: true },
    { id: 2, user: 'João Pereira', terminal: 'DP World Santos', service: 'Alfândega', type: 'Crítica', rating: null, comment: 'Atraso na liberação da carga devido à falha no sistema alfandegário. Precisamos de mais agilidade.', time: '4h atrás', isPublic: true },
    { id: 3, user: 'Mariana Costa', terminal: 'Terminal STS10', service: 'Balança', type: 'Sugestão', rating: null, comment: 'Infraestrutura moderna, mas filas muito grandes na balança. Sugiro mais turnos no horário de pico.', time: '5h atrás', isPublic: true },
    { id: 4, user: 'Pedro Alves', terminal: 'Brasil Terminal Portuário (BTP)', service: 'Rebocadores', type: 'Elogio', rating: 10, comment: 'Tudo dentro do prazo. Operação muito segura e equipe bem treinada.', time: '8h atrás', isPublic: true },
    { id: 5, user: 'Ana Souza', terminal: 'Rumo Logística', service: 'Logística', type: 'Avaliação', rating: 8, comment: 'Serviço de logística eficiente, mas poderia melhorar a comunicação com o transportador.', time: '12h atrás', isPublic: true },
    { id: 6, user: 'Roberto Lima', terminal: 'Ecoporto Santos', service: 'Segurança', type: 'Crítica', rating: null, comment: 'Protocolos de segurança precisam ser revistos urgentemente. Observei irregularidades durante a inspeção.', time: '1 dia atrás', isPublic: true },
    { id: 7, user: 'Fernanda Rocha', terminal: 'Copersucar', service: 'Fornecimento de Combustível', type: 'Feedback', rating: 7, comment: 'O fornecimento de combustível foi satisfatório, mas o tempo de espera poderia ser reduzido.', time: '1 dia atrás', isPublic: true },
    { id: 8, user: 'Lucas Mendes', terminal: 'Santos Brasil', service: 'Inspeção Sanitária', type: 'Elogio', rating: 9, comment: 'Inspeção sanitária feita com muito profissionalismo. Equipe atenciosa e organizada.', time: '2 dias atrás', isPublic: true },
  ];

  const allTerminals = [...new Set(mockComments.map(c => c.terminal))];
  const allServices = [...new Set(mockComments.map(c => c.service))];
  const allTypes = ['Elogio', 'Crítica', 'Sugestão', 'Avaliação', 'Feedback'];

  const [filterTerminal, setFilterTerminal] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [filterService, setFilterService] = React.useState('');

  const filtered = mockComments.filter(c => {
    if (filterTerminal && c.terminal !== filterTerminal) return false;
    if (filterType && c.type !== filterType) return false;
    if (filterService && c.service !== filterService) return false;
    return true;
  });

  const typeColors: Record<string, string> = {
    Elogio: 'bg-green-100 text-green-700',
    Crítica: 'bg-red-100 text-red-700',
    Sugestão: 'bg-yellow-100 text-yellow-700',
    Avaliação: 'bg-blue-100 text-blue-700',
    Feedback: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comentários Públicos</h1>
          <p className="text-gray-500 text-sm mt-1">Percepções reais dos usuários sobre os serviços portuários</p>
        </div>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          {filtered.length} comentário{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-gray-600 mr-1">Filtros:</span>

        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
          <option value="">Todos os tipos</option>
          {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filterTerminal} onChange={e => setFilterTerminal(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
          <option value="">Todos os terminais</option>
          {allTerminals.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filterService} onChange={e => setFilterService(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
          <option value="">Todos os serviços</option>
          {allServices.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {(filterTerminal || filterType || filterService) && (
          <button onClick={() => { setFilterTerminal(''); setFilterType(''); setFilterService(''); }}
            className="text-xs text-red-500 hover:underline font-medium ml-auto">
            Limpar filtros
          </button>
        )}
      </div>

      {/* Comments List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum comentário encontrado</p>
          <p className="text-sm">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {c.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{c.user}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {c.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{c.comment}"</p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 border-t border-gray-50 pt-3">
                <span className="bg-gray-100 px-2 py-1 rounded-md">🏗️ {c.terminal}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">🔧 {c.service}</span>
                {c.rating !== null && (
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md font-semibold ml-auto">
                    ⭐ {c.rating}/10
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateCommentContent() {
  const terminalsList = ['Santos Brasil', 'DP World Santos', 'Brasil Terminal Portuário (BTP)', 'Ecoporto Santos', 'Rumo Logística', 'Terminal STS10', 'Copersucar', 'Cutrale', 'Outros'];
  const serviceGroups: Record<string, string[]> = {
    '⏠ Apoio à Navegação': ['Praticagem (pilotagem)', 'Rebocadores (towage)', 'Atracação / acostagem', 'Mooring (amarração)', 'Bunkering (abastecimento de combustível)'],
    '🚢 Operacionais Diretos': ['Carga e descarga de mercadorias', 'Manuseio de containers', 'Operações de carga geral', 'Operações de carga especial', 'Operações de granel sólido', 'Operações de granel líquido', 'Ro-ro (roll-on/roll-off)'],
    '📦 Armazenagem & Logística': ['Armazenagem em depósitos gerais', 'Armazenagem alfandegada', 'Pátio de containers', 'Logística integrada', 'Cross-docking', 'Picking e packing', 'Etiquetagem e controle de carga'],
    '🚢 Apoio a Navios': ['Suprimento de água potável', 'Suprimento de energia elétrica', 'Remoção de resíduos oleosos', 'Retirada de resíduos de bordo', 'Manutenção leve em navios'],
    '📑 Administrativos': ['Emissão de AET', 'Inspeção sanitária', 'Desembaraço aduaneiro / alfândega', 'Documentação portuária', 'Registro e contestação de faturas'],
    '🧑‍💼 Agência Marítima': ['Agenciamento marítimo', 'Coordenação de tripulação', 'Gestão de cargas e navegação', 'Despacho documental'],
    '🛠️ Infraestrutura': ['Manutenção de estrutura portuária', 'Avaliação de projetos portuários', 'Expansão de áreas operacionais'],
    '📊 Outros Serviços': ['Monitoramento de navios', 'Serviços de TI e monitoramento', 'Transporte multimodal', 'Outros'],
  };
  const types = ['Avaliação', 'Elogio', 'Crítica', 'Sugestão', 'Feedback'];
  const needsRating = (t: string) => t !== 'Crítica' && t !== 'Sugestão';

  const [type, setType] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);
  const [service, setService] = React.useState('');
  const [terminal, setTerminal] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsRating(type) && rating === 0) return;
    const newReview = {
      user: 'Admin Silva',
      terminal,
      service,
      type,
      rating: needsRating(type) ? rating : null,
      comment,
      isPublic,
      time: 'agora mesmo',
    };
    try {
      await fetch('http://localhost:3001/recentReviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
    } catch {
      console.warn('Could not save to server, continuing anyway.');
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false); setRating(0); setService(''); setTerminal(''); setComment(''); setType(''); setIsPublic(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-24">
        <span className="text-7xl mb-6">🐸</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro Enviado!</h2>
        <p className="text-gray-500 mb-8">Obrigado por compartilhar sua percepção. Ela ajuda a melhorar os serviços do porto.</p>
        <button onClick={handleReset} className="px-6 py-2.5 bg-port-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
          Novo Registro
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Avaliar Serviço Portuário</h1>
        <p className="text-gray-500 text-sm mt-1">Compartilhe sua percepção real sobre o serviço prestado</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        {/* Type selector — pill buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de Registro <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button key={t} type="button" onClick={() => { setType(t); setRating(0); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${type === t ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Service — grouped select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Serviço Portuário <span className="text-red-500">*</span></label>
          <select required value={service} onChange={e => setService(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white text-sm">
            <option value="" disabled>Selecione o serviço</option>
            {Object.entries(serviceGroups).map(([group, items]) => (
              <optgroup key={group} label={group}>
                {items.map(s => <option key={s} value={s}>{s}</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Terminal Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Terminal <span className="text-red-500">*</span></label>
          <select required value={terminal} onChange={e => setTerminal(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white">
            <option value="" disabled>Selecione o terminal</option>
            {terminalsList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Star Rating — only if type needs it */}
        {type && needsRating(type) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Nota (1 a 10) <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-1">
              {[...Array(10)].map((_: any, i: number) => {
                const val = i + 1;
                return (
                  <button key={val} type="button"
                    onMouseEnter={() => setHovered(val)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(val)}
                    className="transition-transform hover:scale-110 focus:outline-none">
                    <Star size={28} className={`transition-colors ${val <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                );
              })}
              {rating > 0 && <span className="ml-3 text-lg font-bold text-gray-700">{rating}/10</span>}
            </div>
            {rating === 0 && <p className="text-xs text-red-500 mt-1">Selecione uma nota para enviar</p>}
          </div>
        )}

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Comentário <span className="text-red-500">*</span></label>
          <textarea required value={comment} onChange={e => setComment(e.target.value)}
            rows={5}
            placeholder="Descreva sua experiência. Seja específico sobre o que funcionou bem ou o que poderia melhorar..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none text-sm" />
          <p className="text-xs text-gray-400 mt-1">{comment.length}/500 caracteres</p>
        </div>

        {/* Public / Private Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {isPublic ? '🌐 Comentário Público' : '🔒 Comentário Privado'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isPublic
                ? 'Visível para todos os usuários do sistema'
                : 'Visível apenas para administradores'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(p => !p)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublic ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </button>
        </div>

        <button type="submit" className="w-full py-3 bg-port-accent hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
          <PlusCircle size={18} /> Enviar Registro
        </button>
      </form>
    </div>
  );
}

function TerminalsContent() {
  const terminals = [
    { id: 1, name: "Santos Brasil", type: "Contêineres", docks: 3, status: "Operando", capacity: "95%" },
    { id: 2, name: "DP World Santos", type: "Multiuso", docks: 4, status: "Manutenção Parcial", capacity: "78%" },
    { id: 3, name: "Brasil Terminal Portuário (BTP)", type: "Contêineres", docks: 3, status: "Operando", capacity: "88%" },
    { id: 4, name: "Ecoporto Santos", type: "Carga Geral", docks: 2, status: "Fechado", capacity: "0%" },
    { id: 5, name: "Rumo Logística", type: "Acúcar e Grãos", docks: 5, status: "Operando", capacity: "99%" },
    { id: 6, name: "Terminal STS10", type: "Contêineres", docks: 4, status: "Operando", capacity: "65%" },
    { id: 7, name: "Copersucar", type: "Açúcar", docks: 2, status: "Operando", capacity: "40%" },
    { id: 8, name: "Cutrale", type: "Sucos", docks: 1, status: "Operando", capacity: "90%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Terminais (Porto de Santos)</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral da operação em todos os terminais ativos</p>
        </div>
        <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors">
          Cadastrar Terminal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {terminals.map(terminal => (
          <div key={terminal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${terminal.status === 'Operando' ? 'bg-green-500' : terminal.status === 'Fechado' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{terminal.name}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${terminal.status === 'Operando' ? 'bg-green-100 text-green-700' : terminal.status === 'Fechado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {terminal.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipo Carga</span>
                  <span className="font-medium text-gray-700">{terminal.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Berços</span>
                  <span className="font-medium text-gray-700">{terminal.docks} ativos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ocupação</span>
                  <span className="font-medium text-gray-700">{terminal.capacity}</span>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5 overflow-hidden">
                <div className={`h-1.5 rounded-full ${parseInt(terminal.capacity) > 90 ? 'bg-red-500' : parseInt(terminal.capacity) > 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: terminal.capacity }}></div>
              </div>

              <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                Ver detalhes operacionais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, open, onClick }: { icon: React.ReactNode, label: string, active?: boolean, open: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${active ? 'bg-blue-800 text-white font-medium' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
      }`}>
      <span className="min-w-5">{icon}</span>
      {open && <span>{label}</span>}
    </button>
  );
}

function MetricCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          {icon}
        </div>
        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded bg-opacity-10 mb-1 ${isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
          }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }: { onNavigate: (view: 'login' | 'register' | 'app') => void }) {
  return (
    <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <span className="text-6xl">🐸</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vindo ao Sapo</h2>
        <p className="text-center text-gray-500 mb-8">Faça login para acessar o painel</p>

        <form onSubmit={(e) => { e.preventDefault(); onNavigate('app'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600" />
              <span className="text-gray-600">Lembrar-me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline font-medium">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Não tem uma conta? <button onClick={() => onNavigate('register')} className="text-blue-600 hover:underline font-medium">Cadastre-se</button>
        </p>
      </div>
    </div>
  );
}

function RegisterScreen({ onNavigate }: { onNavigate: (view: 'login' | 'register' | 'app') => void }) {
  return (
    <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <span className="text-6xl">🐸</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Criar Conta</h2>
        <p className="text-center text-gray-500 mb-8">Junte-se ao Sapo hoje mesmo</p>

        <form onSubmit={(e) => { e.preventDefault(); onNavigate('app'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="João da Silva" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área que trabalha no porto</label>
            <select required defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 bg-white">
              <option value="" disabled>Selecione sua área</option>
              <option value="operacoes">Operações</option>
              <option value="logistica">Logística</option>
              <option value="manutencao">Manutenção</option>
              <option value="administrativo">Administrativo</option>
              <option value="seguranca">Segurança</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
            Cadastrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Já tem uma conta? <button onClick={() => onNavigate('login')} className="text-blue-600 hover:underline font-medium">Fazer login</button>
        </p>
      </div>
    </div>
  );
}

export default App;
