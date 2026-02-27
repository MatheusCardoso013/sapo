import { useState, useEffect } from 'react';

export function useAppData() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/waitTimeData').then(res => res.json()),
            fetch('http://localhost:3001/terminalRankingData').then(res => res.json()),
            fetch('http://localhost:3001/cargoData').then(res => res.json()),
            fetch('http://localhost:3001/recentReviews').then(res => res.json()),
            fetch('http://localhost:3001/portServicesData').then(res => res.json())
        ]).then(([waitTimeData, terminalRankingData, cargoData, recentReviews, portServicesData]) => {
            setData({ waitTimeData, terminalRankingData, cargoData, recentReviews, portServicesData });
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch mock data:", error);
            setLoading(false);
        });
    }, []);

    return { data, loading };
}
