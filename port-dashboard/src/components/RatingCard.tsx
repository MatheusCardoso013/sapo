export const RATING_CARD_COLORS = {
    score: (avg: number) => avg >= 9 ? 'text-green-600' : avg >= 7 ? 'text-blue-600' : 'text-red-500',
    bar: (avg: number) => avg >= 9 ? 'bg-green-500' : avg >= 7 ? 'bg-blue-500' : 'bg-red-400',
};

export function RatingCard({ name, avg, total, elogios, criticas }: {
    name: string;
    avg: number;
    total: number;
    elogios: number;
    criticas: number;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-sm leading-tight pr-2">{name}</h3>
                <span className={`text-2xl font-bold ${RATING_CARD_COLORS.score(avg)}`}>{avg.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full transition-all ${RATING_CARD_COLORS.bar(avg)}`} style={{ width: `${avg * 10}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span>{total} avaliações</span>
                <span className="flex gap-3">
                    <span className="text-green-600">👍 {elogios}</span>
                    <span className="text-red-500">👎 {criticas}</span>
                </span>
            </div>
        </div>
    );
}
