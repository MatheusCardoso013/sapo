import { Star, Anchor } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

function ReviewItem({ review }: { review: any }) {
    return (
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
}

export function DashboardContent({ data }: { data: any }) {
    const { terminalRankingData = [], recentReviews = [] } = data || {};

    const enrichedReviews = recentReviews?.map((r: any) => ({
        ...r,
        type: r.type || 'Avaliação'
    }));

    const criticas = enrichedReviews.filter((r: any) => r.type === 'Crítica');
    const outrasAvaliacoes = enrichedReviews.filter((r: any) => r.type !== 'Crítica');

    return (
        <div className="space-y-6">

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
