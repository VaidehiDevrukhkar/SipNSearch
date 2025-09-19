import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Initialize from persisted session
		setUser(auth.getCurrentUser());
		setLoading(false);
	}, []);

	async function login(email, password) {
		setError(null);
		try {
			const session = auth.signInWithEmailAndPassword(email, password);
			setUser(session);
			return session;
		} catch (e) {
			setError(e.message || 'Login failed');
			throw e;
		}
	}

	async function signup(email, password, profile) {
		setError(null);
		try {
			const session = auth.createUserWithEmailAndPassword(email, password, profile);
			setUser(session);
			return session;
		} catch (e) {
			setError(e.message || 'Signup failed');
			throw e;
		}
	}

	function logout() {
		auth.signOut();
		setUser(null);
	}

	const value = useMemo(() => ({
		user,
		isAuthenticated: !!user,
		isAdmin: !!user?.isAdmin,
		loading,
		error,
		login,
		signup,
		logout
	}), [user, loading, error]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}


