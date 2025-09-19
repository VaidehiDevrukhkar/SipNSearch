// Lightweight local "Firebase" mock using localStorage for auth and Firestore-like data
// This avoids external dependencies while providing a consistent API surface.

const STORAGE_KEYS = {
	users: 'sns_users',
	session: 'sns_session',
	cafes: 'sns_cafes'
};

function readJSON(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch (_) {
		return fallback;
	}
}

function writeJSON(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix = 'id') {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

// Seed demo data on first run
(function ensureSeed() {
	const hasSeed = !!localStorage.getItem(STORAGE_KEYS.cafes);
	if (!hasSeed) {
		const seed = [
			{
				id: generateId('cafe'),
				name: 'The Cozy Corner',
				rating: 4.8,
				reviews: 124,
				distance: 0.5,
				image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
				address: '123 Main St, Downtown Mumbai',
				price: '$$',
				amenities: ['wifi', 'pet-friendly', 'outdoor-seating'],
				isOpen: true,
				hours: '7:00 AM - 10:00 PM',
				featured: true
			}
		];
		writeJSON(STORAGE_KEYS.cafes, seed);
	}
	// Seed admin user
	const users = readJSON(STORAGE_KEYS.users, []);
	if (!users.find(u => u.email === 'admin@sipnsearch.app')) {
		users.push({ id: generateId('user'), email: 'admin@sipnsearch.app', password: 'admin123', displayName: 'Admin', isAdmin: true });
		writeJSON(STORAGE_KEYS.users, users);
	}
})();

// Auth API
export const auth = {
	getCurrentUser() {
		return readJSON(STORAGE_KEYS.session, null);
	},

	signInWithEmailAndPassword(email, password) {
		const users = readJSON(STORAGE_KEYS.users, []);
		const user = users.find(u => u.email === email && u.password === password);
		if (!user) {
			throw new Error('Invalid email or password');
		}
		const session = { id: user.id, email: user.email, displayName: user.displayName || user.email.split('@')[0], isAdmin: !!user.isAdmin };
		writeJSON(STORAGE_KEYS.session, session);
		return session;
	},

	signOut() {
		localStorage.removeItem(STORAGE_KEYS.session);
	},

	createUserWithEmailAndPassword(email, password, profile = {}) {
		const users = readJSON(STORAGE_KEYS.users, []);
		if (users.find(u => u.email === email)) {
			throw new Error('Email already in use');
		}
		const user = { id: generateId('user'), email, password, displayName: profile.displayName || email.split('@')[0], isAdmin: !!profile.isAdmin };
		users.push(user);
		writeJSON(STORAGE_KEYS.users, users);
		const session = { id: user.id, email: user.email, displayName: user.displayName, isAdmin: !!user.isAdmin };
		writeJSON(STORAGE_KEYS.session, session);
		return session;
	}
};

// Firestore-like API for cafes
export const db = {
	listCafes() {
		return readJSON(STORAGE_KEYS.cafes, []);
	},
	getCafeById(id) {
		return this.listCafes().find(c => c.id === id) || null;
	},
	createCafe(partial) {
		const cafes = this.listCafes();
		const cafe = { id: generateId('cafe'), name: '', rating: 0, reviews: 0, distance: 0, image: '', address: '', price: '$$', amenities: [], isOpen: true, hours: '', featured: false, ...partial };
		cafes.push(cafe);
		writeJSON(STORAGE_KEYS.cafes, cafes);
		return cafe;
	},
	updateCafe(id, updates) {
		const cafes = this.listCafes();
		const index = cafes.findIndex(c => c.id === id);
		if (index === -1) throw new Error('Cafe not found');
		cafes[index] = { ...cafes[index], ...updates };
		writeJSON(STORAGE_KEYS.cafes, cafes);
		return cafes[index];
	},
	deleteCafe(id) {
		const cafes = this.listCafes();
		const updated = cafes.filter(c => c.id !== id);
		writeJSON(STORAGE_KEYS.cafes, updated);
	}
};

export default { auth, db };


