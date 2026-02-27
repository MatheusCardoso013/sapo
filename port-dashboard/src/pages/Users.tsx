const users = [
    { id: 1, name: 'Claudio Bucanero', email: 'claudio.bucanero@porto.com', area: 'Operações', since: '05/01/2025', role: 'Cliente', initials: 'CB', active: true },
    { id: 2, name: 'João Pedro Unger', email: 'joao.unger@porto.com', area: 'Logística', since: '12/01/2025', role: 'Cliente', initials: 'JU', active: true },
    { id: 3, name: 'Vinicius Do Bras', email: 'vinicius.bras@porto.com', area: 'Segurança', since: '18/01/2025', role: 'Cliente', initials: 'VB', active: true },
    { id: 4, name: 'Fernando Gil', email: 'fernando.gil@porto.com', area: 'Manutenção', since: '25/01/2025', role: 'Cliente', initials: 'FG', active: false },
    { id: 5, name: 'Ana Ribeiro', email: 'ana.ribeiro@porto.com', area: 'Administrativo', since: '03/02/2025', role: 'Cliente', initials: 'AR', active: true },
    { id: 6, name: 'Marcos Tavares', email: 'marcos.tavares@porto.com', area: 'Outros', since: '10/02/2025', role: 'Cliente', initials: 'MT', active: true },
    { id: 7, name: 'Beatriz Nunes', email: 'beatriz.nunes@porto.com', area: 'Operações', since: '14/02/2025', role: 'Cliente', initials: 'BN', active: true },
    { id: 8, name: 'Lucas Freitas', email: 'lucas.freitas@porto.com', area: 'Logística', since: '20/02/2025', role: 'Cliente', initials: 'LF', active: false },
];

export function UsersContent() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🧑‍💻 Usuários Cadastrados</h1>
                    <p className="text-gray-500 text-sm mt-1">Todos os clientes registrados na plataforma</p>
                </div>
                <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                    {users.length} usuário{users.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Usuário</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Área</th>
                                <th className="px-6 py-4 font-medium">Cadastro</th>
                                <th className="px-6 py-4 font-medium">Papel</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                {user.initials}
                                            </div>
                                            <span className="font-medium text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.area}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{user.since}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.active ? 'Ativo' : 'Inativo'}
                                        </span>
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
