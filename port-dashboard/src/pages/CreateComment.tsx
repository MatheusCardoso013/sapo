import React from 'react';
import { Star, PlusCircle } from 'lucide-react';

const terminalsList = ['Santos Brasil', 'DP World Santos', 'Brasil Terminal Portuário (BTP)', 'Ecoporto Santos', 'Rumo Logística', 'Terminal STS10', 'Copersucar', 'Cutrale', 'Outros'];
const serviceGroups: Record<string, string[]> = {
    '⛵ Apoio à Navegação': ['Praticagem (pilotagem)', 'Rebocadores (towage)', 'Atracação / acostagem', 'Mooring (amarração)', 'Bunkering (abastecimento de combustível)'],
    '🚢 Operacionais Diretos': ['Carga e descarga de mercadorias', 'Manuseio de containers', 'Operações de granel sólido', 'Operações de granel líquido', 'Ro-ro (roll-on/roll-off)'],
    '📦 Armazenagem & Logística': ['Armazenagem alfandegada', 'Logística integrada', 'Cross-docking'],
    '📑 Administrativos': ['Inspeção sanitária', 'Desembaraço aduaneiro / alfândega', 'Documentação portuária'],
    '🛠️ Infraestrutura': ['Manutenção de estrutura portuária'],
    '📊 Outros Serviços': ['Monitoramento de navios', 'Outros'],
};
const types = ['Avaliação', 'Elogio', 'Crítica', 'Sugestão', 'Feedback'];
const needsRating = (t: string) => t !== 'Crítica' && t !== 'Sugestão';

export function CreateCommentContent() {
    const [type, setType] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [hovered, setHovered] = React.useState(0);
    const [service, setService] = React.useState('');
    const [terminal, setTerminal] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [isPublic, setIsPublic] = React.useState(true);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (needsRating(type) && rating === 0) return;
        const newReview = { user: 'Admin Silva', terminal, service, type, rating: needsRating(type) ? rating : null, comment, isPublic, time: 'agora mesmo' };
        console.log('Novo registro enviado:', newReview);
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
                <p className="text-gray-500 mb-8">Obrigado por compartilhar sua percepção.</p>
                <button onClick={handleReset} className="px-6 py-2.5 bg-port-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">Novo Registro</button>
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
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Serviço Portuário <span className="text-red-500">*</span></label>
                    <select required value={service} onChange={e => setService(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white text-sm">
                        <option value="" disabled>Selecione o serviço</option>
                        {Object.entries(serviceGroups).map(([group, items]) => (
                            <optgroup key={group} label={group}>
                                {items.map(s => <option key={s} value={s}>{s}</option>)}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Terminal <span className="text-red-500">*</span></label>
                    <select required value={terminal} onChange={e => setTerminal(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white">
                        <option value="" disabled>Selecione o terminal</option>
                        {terminalsList.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                {type && needsRating(type) && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Nota (1 a 10) <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-1">
                            {[...Array(10)].map((_: any, i: number) => {
                                const val = i + 1;
                                return (
                                    <button key={val} type="button" onMouseEnter={() => setHovered(val)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(val)} className="transition-transform hover:scale-110">
                                        <Star size={28} className={`transition-colors ${val <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    </button>
                                );
                            })}
                            {rating > 0 && <span className="ml-3 text-lg font-bold text-gray-700">{rating}/10</span>}
                        </div>
                        {rating === 0 && <p className="text-xs text-red-500 mt-1">Selecione uma nota para enviar</p>}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comentário <span className="text-red-500">*</span></label>
                    <textarea required value={comment} onChange={e => setComment(e.target.value)} rows={5}
                        placeholder="Descreva sua experiência..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none text-sm" />
                    <p className="text-xs text-gray-400 mt-1">{comment.length}/500 caracteres</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">{isPublic ? '🌐 Comentário Público' : '🔒 Comentário Privado'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{isPublic ? 'Visível para todos os usuários do sistema' : 'Visível apenas para administradores'}</p>
                    </div>
                    <button type="button" onClick={() => setIsPublic(p => !p)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                <button type="submit" className="w-full py-3 bg-port-accent hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <PlusCircle size={18} /> Enviar Registro
                </button>
            </form>
        </div>
    );
}
