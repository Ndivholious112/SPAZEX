import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useInventory() {
	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		api.getInventory().then((items) => {
			if (!mounted) return;
			setInventory(items);
			setLoading(false);
		});
		return () => { mounted = false; };
	}, []);

	const add = async (item) => {
		const added = await api.addInventoryItem(item);
		setInventory((s) => [added, ...s]);
		return added;
	};

	const update = async (id, changes) => {
		const updated = await api.updateInventoryItem(id, changes);
		setInventory((s) => s.map((it) => (it.id === id ? updated : it)));
		return updated;
	};

	const remove = async (id) => {
		await api.removeInventoryItem(id);
		setInventory((s) => s.filter((it) => it.id !== id));
		return true;
	};

	return { inventory, loading, add, update, remove };
}
