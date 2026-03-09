import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface Terminal {
    id: number;
    name: string;
    type: string;
    docks: number;
    status: 'Operando' | 'Manutenção Parcial' | 'Fechado';
    capacity: string;
    efficiency: number;
    throughput: number;
    createdAt?: string;
}

const getTerminals = (): Terminal[] => {
    const stored = localStorage.getItem('port_terminals');
    return stored ? JSON.parse(stored) : [];
};

const saveTerminal = (terminal: Omit<Terminal, 'id' | 'createdAt'>) => {
    const terminals = getTerminals();
    const newTerminal: Terminal = {
        ...terminal,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    terminals.push(newTerminal);
    localStorage.setItem('port_terminals', JSON.stringify(terminals));
    return newTerminal;
};

const deleteTerminal = (id: number) => {
    const terminals = getTerminals();
    const filtered = terminals.filter(t => t.id !== id);
    localStorage.setItem('port_terminals', JSON.stringify(filtered));
};

export function TerminalsContent({ userEmail }: { userEmail: string }) {
    const [showModal, setShowModal] = useState(false);
    const [customTerminals, setCustomTerminals] = useState<Terminal[]>([]);
    
    const isAdmin = userEmail === 'admin@sapo.com';
    
    const defaultTerminals: Terminal[] = [
        { id: 1, name: "Santos Brasil", type: "Contêineres", docks: 3, status: "Operando", capacity: "95%", efficiency: 92, throughput: 150 },
        { id: 2, name: "DP World Santos", type: "Contêineres", docks: 4, status: "Manutenção Parcial", capacity: "78%", efficiency: 78, throughput: 110 },
        { id: 3, name: "Brasil Terminal Portuário", type: "Contêineres", docks: 3, status: "Operando", capacity: "88%", efficiency: 88, throughput: 95 },
        { id: 4, name: "Ecoporto Santos", type: "Carga Geral", docks: 2, status: "Fechado", capacity: "0%", efficiency: 0, throughput: 0 },
    ];

    const terminals = [...defaultTerminals, ...customTerminals];

    useEffect(() => {
        setCustomTerminals(getTerminals());
    }, []);

    const handleAddTerminal = (terminal: Omit<Terminal, 'id' | 'createdAt'>) => {
        const newTerminal = saveTerminal(terminal);
        setCustomTerminals(prev => [...prev, newTerminal]);
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        deleteTerminal(id);
        setCustomTerminals(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Terminais (Porto de Santos)</h1>
                    <p className="text-gray-500 text-sm mt-1">Visão geral da operação e eficiência de todos os terminais</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Cadastrar Terminal
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {terminals.map(terminal => (
                    <div key={terminal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-2 ${terminal.status === 'Operando' ? 'bg-green-500' : terminal.status === 'Fechado' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-800 text-lg leading-tight pr-2">{terminal.name}</h3>
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
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Eficiência</span>
                                    <span className={`font-bold ${terminal.efficiency >= 85 ? 'text-green-600' : terminal.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {terminal.efficiency}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Throughput</span>
                                    <span className="font-medium text-gray-700">{terminal.throughput}k TEU</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5 overflow-hidden">
                                <div className={`h-1.5 rounded-full ${parseInt(terminal.capacity) > 90 ? 'bg-red-500' : parseInt(terminal.capacity) > 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: terminal.capacity }}></div>
                            </div>
                            
                            {isAdmin && terminal.createdAt && (
                                <button 
                                    onClick={() => handleDelete(terminal.id)}
                                    className="w-full py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 mb-2"
                                >
                                    Remover Terminal
                                </button>
                            )}
                            
                            <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                Ver detalhes operacionais
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && <AddTerminalModal onClose={() => setShowModal(false)} onAdd={handleAddTerminal} />}
        </div>
    );
}

function AddTerminalModal({ onClose, onAdd }: { 
    onClose: () => void; 
    onAdd: (terminal: Omit<Terminal, 'id' | 'createdAt'>) => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        docks: 1,
        status: 'Operando' as Terminal['status'],
        capacity: '0',
        efficiency: 0,
        throughput: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            capacity: `${formData.capacity}%`
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Cadastrar Novo Terminal</h2>
                        <p className="text-sm text-gray-500 mt-1">Preencha os dados do terminal portuário</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Terminal *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: Terminal Santos XYZ"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Carga *</label>
                            <select
                                required
                                value={formData.type}
                                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">Selecione...</option>
                                <option value="Contêineres">Contêineres</option>
                                <option value="Carga Geral">Carga Geral</option>
                                <option value="Granel Sólido">Granel Sólido</option>
                                <option value="Granel Líquido">Granel Líquido</option>
                                <option value="Açúcar">Açúcar</option>
                                <option value="Açúcar e Grãos">Açúcar e Grãos</option>
                                <option value="Multiuso">Multiuso</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status Operacional *</label>
                            <select
                                required
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Terminal['status'] }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="Operando">Operando</option>
                                <option value="Manutenção Parcial">Manutenção Parcial</option>
                                <option value="Fechado">Fechado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Berços *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="20"
                                value={formData.docks}
                                onChange={e => setFormData(prev => ({ ...prev, docks: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: 3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ocupação Atual (%) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={formData.capacity}
                                onChange={e => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: 85"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Eficiência Operacional (%) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={formData.efficiency}
                                onChange={e => setFormData(prev => ({ ...prev, efficiency: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: 92"
                            />
                            <p className="text-xs text-gray-500 mt-1">Taxa de aproveitamento da capacidade</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Throughput Mensal (mil TEUs) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.throughput}
                                onChange={e => setFormData(prev => ({ ...prev, throughput: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: 150"
                            />
                            <p className="text-xs text-gray-500 mt-1">Volume movimentado por mês</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Dica:</strong> Os dados de eficiência operacional ajudam a identificar gargalos e oportunidades de melhoria na gestão portuária.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
                        >
                            Cadastrar Terminal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
