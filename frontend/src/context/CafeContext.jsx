import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCafes, createCafe, updateCafe, deleteCafe, getCafeById } from '../services/cafeService';
import { useAuth } from './AuthContext';

const CafeContext = createContext(null);

export function CafeProvider({ children }) {
	const [cafes, setCafes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();

	async function load(options = {}) {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchCafes({ onlyAdminPosted: true, ...options });
			setCafes(data);
		} catch (e) {
			setError(e.message || 'Failed to load cafes');
		} finally {
			setLoading(false);
		}
	}

	async function addCafe(data) {
		const created = await createCafe({
			...data,
			createdAt: Date.now(),
			createdBy: user ? { id: user.id, email: user.email, isAdmin: !!isAdmin } : null
		});
		setCafes(prev => [created, ...prev]);
		return created;
	}

	async function editCafe(id, updates) {
		const updated = await updateCafe(id, updates);
		setCafes(prev => prev.map(c => (c.id === id ? updated : c)));
		return updated;
	}

	async function removeCafe(id) {
		await deleteCafe(id);
		setCafes(prev => prev.filter(c => c.id !== id));
	}

	async function getById(id) {
		return await getCafeById(id);
	}

	useEffect(() => {
		load();
	}, []);

	const value = useMemo(() => ({ cafes, loading, error, load, addCafe, editCafe, removeCafe, getById }), [cafes, loading, error]);

	return (
		<CafeContext.Provider value={value}>
			{children}
		</CafeContext.Provider>
	);
}

export function useCafes() {
	const ctx = useContext(CafeContext);
	if (!ctx) throw new Error('useCafes must be used within CafeProvider');
	return ctx;
}


