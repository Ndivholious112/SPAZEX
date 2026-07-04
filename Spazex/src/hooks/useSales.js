import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useSales() {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		api.getSales().then((items) => {
			if (!mounted) return;
			setSales(items);
			setLoading(false);
		});
		return () => { mounted = false; };
	}, []);

	const add = async (sale) => {
		const added = await api.addSale(sale);
		setSales((s) => [added, ...s]);
		return added;
	};

	return { sales, loading, add };
}
