import { RatingCard } from '../components/RatingCard';

const terminalRatings = [
    { name: 'Santos Brasil', avg: 9.2, total: 48, elogios: 32, criticas: 4 },
    { name: 'Terminal STS10', avg: 8.7, total: 35, elogios: 25, criticas: 3 },
    { name: 'Brasil Terminal Portuário (BTP)', avg: 8.4, total: 29, elogios: 20, criticas: 5 },
    { name: 'DP World Santos', avg: 7.9, total: 22, elogios: 14, criticas: 6 },
    { name: 'Rumo Logística', avg: 9.5, total: 18, elogios: 16, criticas: 1 },
    { name: 'Ecoporto Santos', avg: 6.3, total: 12, elogios: 5, criticas: 6 },
    { name: 'Copersucar', avg: 8.1, total: 10, elogios: 7, criticas: 2 },
    { name: 'Cutrale', avg: 8.8, total: 9, elogios: 7, criticas: 1 },
];

export function TerminalAvaliacoesContent() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">🏗️ Avaliação de Terminal</h1>
                <p className="text-gray-500 text-sm mt-1">Média das notas recebidas por cada terminal do Porto de Santos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {terminalRatings.map(t => <RatingCard key={t.name} {...t} />)}
            </div>
        </div>
    );
}
