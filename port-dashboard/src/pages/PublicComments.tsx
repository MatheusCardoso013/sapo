import React from 'react';
import { MessageSquare } from 'lucide-react';

const mockComments = [
    { id: 1, user: 'Carlos Silva', terminal: 'Santos Brasil', service: 'Praticagem', type: 'Elogio', rating: 10, comment: 'Processo de atracação muito rápido hoje. Equipe extremamente profissional e ágil.', time: '2h atrás', isPublic: true },
    { id: 2, user: 'João Pereira', terminal: 'DP World Santos', service: 'Alfândega', type: 'Crítica', rating: null as any, comment: 'Atraso na liberação da carga devido à falha no sistema alfandegário. Precisamos de mais agilidade.', time: '4h atrás', isPublic: true },
    { id: 3, user: 'Mariana Costa', terminal: 'Terminal STS10', service: 'Balança', type: 'Sugestão', rating: null as any, comment: 'Infraestrutura moderna, mas filas muito grandes na balança. Sugiro mais turnos no horário de pico.', time: '5h atrás', isPublic: true },
    { id: 4, user: 'Pedro Alves', terminal: 'Brasil Terminal Portuário (BTP)', service: 'Rebocadores', type: 'Elogio', rating: 10, comment: 'Tudo dentro do prazo. Operação muito segura e equipe bem treinada.', time: '8h atrás', isPublic: true },
    { id: 5, user: 'Ana Souza', terminal: 'Rumo Logística', service: 'Logística', type: 'Avaliação', rating: 8, comment: 'Serviço de logística eficiente, mas poderia melhorar a comunicação com o transportador.', time: '12h atrás', isPublic: true },
    { id: 6, user: 'Roberto Lima', terminal: 'Ecoporto Santos', service: 'Segurança', type: 'Crítica', rating: null as any, comment: 'Protocolos de segurança precisam ser revistos urgentemente. Observei irregularidades durante a inspeção.', time: '1 dia atrás', isPublic: true },
    { id: 7, user: 'Fernanda Rocha', terminal: 'Copersucar', service: 'Fornecimento de Combustível', type: 'Feedback', rating: 7, comment: 'O fornecimento de combustível foi satisfatório, mas o tempo de espera poderia ser reduzido.', time: '1 dia atrás', isPublic: true },
    { id: 8, user: 'Lucas Mendes', terminal: 'Santos Brasil', service: 'Inspeção Sanitária', type: 'Elogio', rating: 9, comment: 'Inspeção sanitária feita com muito profissionalismo. Equipe atenciosa e organizada.', time: '2 dias atrás', isPublic: true },
];

const allTerminals = [...new Set(mockComments.map(c => c.terminal))];
const allServices = [...new Set(mockComments.map(c => c.service))];
const allTypes = ['Elogio', 'Crítica', 'Sugestão', 'Avaliação', 'Feedback'];

const typeColors: Record<string, string> = {
    Elogio: 'bg-green-100 text-green-700',
    Crítica: 'bg-red-100 text-red-700',
    Sugestão: 'bg-yellow-100 text-yellow-700',
    Avaliação: 'bg-blue-100 text-blue-700',
    Feedback: 'bg-purple-100 text-purple-700',
};

export function PublicCommentsContent() {
    const [filterTerminal, setFilterTerminal] = React.useState('');
    const [filterType, setFilterType] = React.useState('');
    const [filterService, setFilterService] = React.useState('');

    const filtered = mockComments.filter(c => {
        if (filterTerminal && c.terminal !== filterTerminal) return false;
        if (filterType && c.type !== filterType) return false;
        if (filterService && c.service !== filterService) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Comentários Públicos</h1>
                    <p className="text-gray-500 text-sm mt-1">Percepções reais dos usuários sobre os serviços portuários</p>
                </div>
                <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                    {filtered.length} comentário{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>
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
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[c.type] ?? 'bg-gray-100 text-gray-600'}`}>{c.type}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{c.comment}"</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 border-t border-gray-50 pt-3">
                                <span className="bg-gray-100 px-2 py-1 rounded-md">{c.terminal}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-md">{c.service}</span>
                                {c.rating !== null && (
                                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md font-semibold ml-auto">Nota: {c.rating}/10</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
