import React from 'react';
import { Search } from 'lucide-react';
import { RATING_CARD_COLORS } from '../components/RatingCard';

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

export function ServicoAvaliacoesContent() {
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
