import {
    waitTimeData,
    terminalRankingData,
    cargoData,
    recentReviews,
    portServicesData,
} from '../data/mockData';

export function useAppData() {
    const data = { waitTimeData, terminalRankingData, cargoData, recentReviews, portServicesData };
    return { data, loading: false };
}
