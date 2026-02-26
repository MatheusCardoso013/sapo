import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Ship, Anchor, Clock, Star, MessageSquare, Menu, Bell, Search,
  TrendingUp, TrendingDown, MoreVertical, LogOut, FileText, Activity
} from 'lucide-react';

const waitTimeData = [
  { name: 'Seg', tempo: 12 },
  { name: 'Ter', tempo: 19 },
  { name: 'Qua', tempo: 15 },
  { name: 'Qui', tempo: 22 },
  { name: 'Sex', tempo: 18 },
  { name: 'Sáb', tempo: 10 },
  { name: 'Dom', tempo: 8 },
];

const terminalRankingData = [
  { name: 'Terminal STS10', score: 9.8, load: 120 },
  { name: 'Brasil Terminal', score: 8.5, load: 95 },
  { name: 'Santos Brasil', score: 8.2, load: 150 },
  { name: 'Ecoporto', score: 7.9, load: 80 },
  { name: 'DP World', score: 7.5, load: 110 },
];

const cargoData = [
  { name: 'Granel Sólido', value: 45 },
  { name: 'Contêineres', value: 35 },
  { name: 'Carga Geral', value: 15 },
  { name: 'Líquidos', value: 5 },
];
const COLORS = ['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B'];

const recentReviews = [
  { id: 1, user: 'Carlos Silva', terminal: 'Santos Brasil', rating: 5, comment: 'Processo de atracação muito rápido hoje. Excelente equipe.', time: '2h atrás' },
  { id: 2, user: 'João Pereira', terminal: 'DP World', rating: 3, comment: 'Atraso na liberação da carga devido à falha no sistema alfandegário.', time: '4h atrás' },
  { id: 3, user: 'Mariana Costa', terminal: 'Terminal STS10', rating: 4, comment: 'Infraestrutura moderna, mas filas grandes na balança.', time: '5h atrás' },
  { id: 4, user: 'Pedro Alves', terminal: 'Brasil Terminal', rating: 5, comment: 'Tudo dentro do prazo. Operação muito segura.', time: '8h atrás' },
];

// Mock data for Port Services Reports
const portServicesData = [
  { id: '1', name: 'Praticagem', status: 'Operacional', requests: 145, avgResponseTime: '15 min', satisfaction: 4.9 },
  { id: '2', name: 'Rebocadores', status: 'Alta Demanda', requests: 89, avgResponseTime: '25 min', satisfaction: 4.5 },
  { id: '3', name: 'Fornecimento de Combustível', status: 'Operacional', requests: 34, avgResponseTime: '2 h', satisfaction: 4.2 },
  { id: '4', name: 'Coleta de Resíduos', status: 'Manutenção', requests: 12, avgResponseTime: '4 h', satisfaction: 3.8 },
  { id: '5', name: 'Inspeção Sanitária', status: 'Operacional', requests: 56, avgResponseTime: '45 min', satisfaction: 4.7 },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-port-gray flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-port-blue text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between h-16 border-b border-blue-800">
          {sidebarOpen && <span className="font-bold text-lg truncate flex items-center gap-2"><Anchor size={20} /> Porto Analytics</span>}
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
          <NavItem icon={<Ship />} label="Terminais e Navios" open={sidebarOpen} onClick={() => { }} />
          <NavItem icon={<Clock />} label="Tempo de Espera" open={sidebarOpen} onClick={() => { }} />
          <NavItem icon={<Star />} label="Avaliações" open={sidebarOpen} onClick={() => { }} />
          <NavItem icon={<MessageSquare />} label="Comentários Públicos" open={sidebarOpen} onClick={() => { }} />
        </nav>
        <div className="p-4 border-t border-blue-800">
          <NavItem icon={<LogOut />} label="Sair" open={sidebarOpen} onClick={() => { }} />
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
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' ? <DashboardContent /> : <ReportsContent />}
        </div>
      </main>
    </div>
  );
}

function DashboardContent() {
  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral dos Serviços Portuários</h1>
          <p className="text-gray-500 text-sm mt-1">Monitoramento em tempo real do Porto de Santos</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Exportar PDF
          </button>
          <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors">
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Média de Avaliações"
          value="4.8/5"
          trend="+0.2"
          isPositive={true}
          icon={<Star className="text-yellow-500" size={24} />}
        />
        <MetricCard
          title="Tempo Médio de Espera"
          value="14h 30m"
          trend="-1.5h"
          isPositive={true}
          icon={<Clock className="text-blue-500" size={24} />}
        />
        <MetricCard
          title="Navios Atracados"
          value="42"
          trend="+4"
          isPositive={true}
          icon={<Ship className="text-green-500" size={24} />}
        />
        <MetricCard
          title="Alertas Ativos"
          value="3"
          trend="+1"
          isPositive={false}
          icon={<TrendingDown className="text-red-500" size={24} />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Tempo de Espera na Barra (Horas)</h2>
            <select className="text-sm bg-gray-50 border-gray-200 rounded text-gray-600 px-2 py-1 outline-none">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="monotone" dataKey="tempo" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="font-semibold text-gray-800 mb-2">Composição de Cargas</h2>
          <div className="flex-1 flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={cargoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cargoData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">100%</span>
              <span className="text-xs text-gray-500">Volume Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {cargoData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-600 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Ranking de Terminais (Desempenho)</h2>
            <button className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">Ver todos</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terminalRankingData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="score" fill="#1E3A8A" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Avaliações e Comentários Recentes</h2>
            <button className="text-port-accent text-sm font-medium hover:underline">Ver todas</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {recentReviews.map(review => (
              <div key={review.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gray-50/50 group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-sm text-gray-800">{review.user}</span>
                    <span className="text-xs text-gray-500 ml-2 bg-gray-200 px-2 py-0.5 rounded-full">{review.terminal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">&quot;{review.comment}&quot;</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{review.time}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-port-accent">
                    Responder <MessageSquare size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

function ReportsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios e Qualidade de Serviços</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe métricas detalhadas dos serviços portuários</p>
        </div>
        <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
          <FileText size={18} /> Novo Relatório Customizado
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Activity size={20} className="text-port-accent" /> Status dos Serviços Especializados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Serviço</th>
                <th className="px-6 py-4 font-medium">Status Atual</th>
                <th className="px-6 py-4 font-medium">Requisições (24h)</th>
                <th className="px-6 py-4 font-medium">Tempo Médio Resp.</th>
                <th className="px-6 py-4 font-medium">Satisfação Média</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {portServicesData.map((service) => (
                <tr key={service.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{service.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'Operacional' ? 'bg-green-100 text-green-800' :
                        service.status === 'Alta Demanda' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{service.requests}</td>
                  <td className="px-6 py-4 text-gray-600">{service.avgResponseTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-gray-700 font-medium">{service.satisfaction}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-port-accent hover:text-blue-800 text-sm font-medium">Ver Relatório</button>
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

export default App;
