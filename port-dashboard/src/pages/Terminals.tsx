export function TerminalsContent() {
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
