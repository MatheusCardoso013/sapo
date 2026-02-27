const team = [
    { id: 1, name: 'Admin Silva', role: 'Super Admin', area: 'Gestão de Operações', status: 'Ativo', initials: 'AS', since: 'Jan 2023' },
    { id: 2, name: 'Carla Mendonça', role: 'Analista', area: 'Relatórios e Qualidade', status: 'Ativo', initials: 'CM', since: 'Mar 2023' },
    { id: 3, name: 'Roberto Faria', role: 'Inspetor', area: 'Segurança Portuária', status: 'Ativo', initials: 'RF', since: 'Jun 2023' },
    { id: 4, name: 'Patricia Leão', role: 'Coordenadora', area: 'Logística', status: 'Ativo', initials: 'PL', since: 'Set 2023' },
    { id: 5, name: 'Marcos Vieira', role: 'Técnico', area: 'Infraestrutura', status: 'Inativo', initials: 'MV', since: 'Fev 2024' },
    { id: 6, name: 'Juliana Castro', role: 'Auditora', area: 'Compliance', status: 'Ativo', initials: 'JC', since: 'Abr 2024' },
];

export function TeamContent() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">👥 Equipe</h1>
                    <p className="text-gray-500 text-sm mt-1">Membros da equipe interna do SAPO</p>
                </div>
                <button className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    + Adicionar Membro
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {team.map(member => (
                    <div key={member.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center border border-blue-200 shadow-sm flex-shrink-0">
                                {member.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{member.name}</p>
                                <p className="text-xs text-gray-500 truncate">{member.role}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {member.status}
                            </span>
                        </div>
                        <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Área</span>
                                <span className="font-medium text-right max-w-[160px] truncate">{member.area}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Desde</span>
                                <span className="font-medium">{member.since}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
