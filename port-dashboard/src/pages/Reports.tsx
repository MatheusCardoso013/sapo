import React from 'react';
import { Star, Search, FileText } from 'lucide-react';

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

const statusOptions = ['Operacional', 'Alta Demanda', 'Manutenção'];
const monthOptions = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const terminalOptions = terminalReports.map(t => t.name);

function statusBadge(s: string) {
    if (s === 'Operacional') return 'bg-green-100 text-green-800';
    if (s === 'Alta Demanda') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}

function buildAutoReport(data: any, selected: any, section: string) {
    const { recentReviews = [] } = data || {};
    const filteredReviews = recentReviews.filter((r: any) =>
        section === 'terminals' ? r.terminal === selected.name : (r.terminal === selected.terminal && r.service === selected.name)
    );
    const total = filteredReviews.length;
    let elogios = 0, criticas = 0, sumScore = 0, countRating = 0;
    filteredReviews.forEach((r: any) => {
        if (r.type === 'Elogio' || (r.rating && r.rating >= 8)) elogios++;
        else if (r.type === 'Crítica' || (r.rating && r.rating <= 5)) criticas++;
        if (r.rating !== undefined && r.rating !== null) { sumScore += Number(r.rating); countRating++; }
    });
    const avgScore = countRating > 0 ? (sumScore / countRating).toFixed(1) : 'N/A';
    let resumo = '';
    if (total === 0) resumo = 'não há comentários suficientes para uma análise detalhada deste período.';
    else if (elogios >= criticas && elogios > 0) resumo = 'a maioria dos usuários está satisfeita com a agilidade e o profissionalismo na operação, destacando o bom desempenho da equipe.';
    else if (criticas > elogios) resumo = 'existem pontos de atenção urgentes, especialmente com reclamações de lentidão e falhas no fluxo que precisam ser revisadas.';
    else resumo = 'as opiniões estão divididas, indicando um serviço regular, mas com bastante espaço para melhorias no atendimento e infraestrutura.';
    const terminalName = section === 'terminals' ? selected.name : selected.terminal;
    const serviceName = section === 'services' ? selected.name : 'operações gerais';
    return `O terminal **${terminalName}**, na área de **${serviceName}**, obteve um total de **${total} avaliações** recentes. Destas, foram registrados **${elogios} elogios** e **${criticas} críticas**. A nota média alcançada foi de **${avgScore}/10**. Em resumo, a análise dos comentários indica que ${resumo}`;
}

export function ReportsContent({ data }: { data: any }) {
    const [serviceReports, setServiceReports] = React.useState(initialServiceReports);
    const [section, setSection] = React.useState<'services' | 'terminals'>('services');
    const [search, setSearch] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState('');
    const [filterTerminal, setFilterTerminal] = React.useState('');
    const [filterMinEvals, setFilterMinEvals] = React.useState('');
    const [filterMinScore, setFilterMinScore] = React.useState('');
    const [filterMonth, setFilterMonth] = React.useState('');
    const [selected, setSelected] = React.useState<any | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
    const [reportTerminal, setReportTerminal] = React.useState('');
    const [reportService, setReportService] = React.useState('');
    const [reportMonth, setReportMonth] = React.useState('');
    const [generatedReportText, setGeneratedReportText] = React.useState('');

    const generateReport = () => {
        if (!reportTerminal || !reportService) { alert('Selecione um terminal e um serviço para gerar o relatório.'); return; }
        const { recentReviews = [] } = data || {};
        const filteredReviews = recentReviews.filter((r: any) => r.terminal === reportTerminal && r.service === reportService);
        const total = filteredReviews.length;
        let elogios = 0, criticas = 0, sumScore = 0, countRating = 0;
        filteredReviews.forEach((r: any) => {
            if (r.type === 'Elogio' || (r.rating && r.rating >= 8)) elogios++;
            else if (r.type === 'Crítica' || (r.rating && r.rating <= 5)) criticas++;
            if (r.rating !== undefined && r.rating !== null) { sumScore += Number(r.rating); countRating++; }
        });
        const avgScore = countRating > 0 ? (sumScore / countRating).toFixed(1) : 'N/A';
        let resumo = '';
        if (total === 0) resumo = 'não há comentários suficientes para uma análise detalhada deste período.';
        else if (elogios >= criticas && elogios > 0) resumo = 'a maioria dos usuários está satisfeita com a agilidade e o profissionalismo na operação, destacando o bom desempenho da equipe.';
        else if (criticas > elogios) resumo = 'existem pontos de atenção urgentes, especialmente com reclamações de lentidão e falhas no fluxo que precisam ser revisadas.';
        else resumo = 'as opiniões estão divididas, indicando um serviço regular, mas com bastante espaço para melhorias no atendimento e infraestrutura.';
        const monthText = reportMonth ? ` no mês de **${reportMonth}**` : '';
        setGeneratedReportText(`O terminal **${reportTerminal}**, na área de **${reportService}**, obteve um total de **${total} avaliações** recentes${monthText}. Destas, foram registrados **${elogios} elogios** e **${criticas} críticas**. A nota média alcançada foi de **${avgScore}/10**. Em resumo, a análise dos comentários indica que ${resumo}`);
    };

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

    const clearFilters = () => { setSearch(''); setFilterStatus(''); setFilterTerminal(''); setFilterMinEvals(''); setFilterMinScore(''); setFilterMonth(''); };

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

    if (selected) {
        const s = selected as any;
        const mockTrend = [80, 95, 88, 102, 120, 110, 98];
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        const autoReportText = buildAutoReport(data, s, section);
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelected(null)} className="text-sm text-blue-600 hover:underline flex items-center gap-1">← Voltar</button>
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
                    <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-xl relative">
                        <h3 className="text-sm font-bold text-blue-800 mb-3 absolute top-[-10px] bg-blue-100 px-3 py-0.5 rounded-full inline-block">✨ Síntese Automática</h3>
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pt-2"
                            dangerouslySetInnerHTML={{ __html: autoReportText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[{ label: 'Requisições (24h)', val: s.requests }, { label: 'Tempo Médio Resp.', val: s.avgResponseTime }, { label: 'Satisfação Média', val: `${s.satisfaction}/10` }, { label: 'Taxa de Re-chamada', val: '4.2%' }].map(k => (
                            <div key={k.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                                <p className="text-2xl font-bold text-gray-800">{k.val}</p>
                                <p className="text-xs text-gray-500 mt-1">{k.label}</p>
                            </div>
                        ))}
                    </div>
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
                    <button onClick={() => { setIsReportModalOpen(true); setGeneratedReportText(''); }}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
                        ✨ Gerar Texto Descritivo
                    </button>
                    <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
                        <FileText size={18} /> Exportar
                    </button>
                </div>
            </div>

            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">✨ Gerar Relatório Descritivo</h2>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">✕</button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-6">Selecione o terminal e o serviço para gerar uma síntese automática com base nos comentários e avaliações recentes do sistema.</p>
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
                                <button onClick={generateReport}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                                    disabled={!reportTerminal || !reportService}>
                                    Gerar Análise
                                </button>
                            </div>
                            {generatedReportText && (
                                <div className="mt-4 p-5 bg-blue-50/50 border border-blue-100 rounded-xl relative">
                                    <h3 className="text-sm font-bold text-blue-800 mb-3 absolute top-[-10px] bg-blue-100 px-3 py-0.5 rounded-full inline-block">Resultado do Relatório</h3>
                                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pt-2"
                                        dangerouslySetInnerHTML={{ __html: generatedReportText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                {(['services', 'terminals'] as const).map(s => (
                    <button key={s} onClick={() => { setSection(s); clearFilters(); }}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${section === s ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>
                        {s === 'services' ? '🔧 Serviços' : '🏗️ Terminais'}
                    </button>
                ))}
            </div>

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
                        <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium">Limpar filtros</button>
                    ) : <span />}
                    <span className="text-sm text-gray-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

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
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(item.status)}`}>{item.status}</span>
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
