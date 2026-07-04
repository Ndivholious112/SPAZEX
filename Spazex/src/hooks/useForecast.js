import { useState, useEffect } from 'react';
import { getSales } from '../services/api';

// Simple frontend forecast: average of last 7 days sales by item (mock)
export default function useForecast() {
	const [forecast, setForecast] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const sales = await getSales();
			if (!mounted) return;

			// Build a simple aggregation by item name
			const byItem = {};
			sales.forEach((s) => {
				const items = s.items || [];
				items.forEach((it) => {
					if (!byItem[it.name]) byItem[it.name] = { qty: 0, revenue: 0, samples: 0 };
					byItem[it.name].qty += it.qty || 1;
					byItem[it.name].revenue += (it.price || 0) * (it.qty || 1);
					byItem[it.name].samples += 1;
				});
			});

			const result = Object.keys(byItem).map((name, idx) => ({
				id: idx + 1,
				name,
				predicted: Math.max(1, Math.round(byItem[name].qty / Math.max(1, byItem[name].samples))),
				price: Math.round(byItem[name].revenue / Math.max(1, byItem[name].qty) * 100) / 100 || 0,
				suggestOrder: Math.max(1, Math.round(byItem[name].qty * 0.5))
			}));

			setForecast({ rows: result, generatedAt: new Date().toISOString() });
			setLoading(false);
		})();

		return () => { mounted = false; };
	}, []);

	return { forecast, loading };
}
