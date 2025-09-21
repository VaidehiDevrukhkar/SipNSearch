// Firebase Auth + local mock DB for cafes

import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
	createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
	signOut as fbSignOut,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged as fbOnAuthStateChanged,
	updateProfile as fbUpdateProfile
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc
} from 'firebase/firestore';

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

// Initialize Firebase App (expects Vite envs)
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestore = getFirestore(app);

// Seed demo cafes on first run (keep local cafe data)
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
})();

// Helpers for user profile stored in Firestore (fallback to localStorage if needed)
async function getUserProfile(uid) {
	try {
		const snap = await getDoc(doc(firestore, 'users', uid));
		return snap.exists() ? snap.data() : null;
	} catch (_) {
		const users = readJSON(STORAGE_KEYS.users, []);
		return users.find(u => u.id === uid) || null;
	}
}

async function upsertUserProfile(uid, data) {
	try {
		await setDoc(doc(firestore, 'users', uid), data, { merge: true });
	} catch (_) {
		const users = readJSON(STORAGE_KEYS.users, []);
		const idx = users.findIndex(u => u.id === uid);
		if (idx === -1) users.push({ id: uid, ...data });
		else users[idx] = { ...users[idx], ...data };
		writeJSON(STORAGE_KEYS.users, users);
	}
}

// Auth API backed by Firebase Auth
export const auth = {
	async getCurrentUser() {
		const u = firebaseAuth.currentUser;
		if (!u) return null;
		const profile = await getUserProfile(u.uid);
		return {
			id: u.uid,
			email: u.email || '',
			displayName: u.displayName || (u.email ? u.email.split('@')[0] : ''),
			role: profile?.role || 'user',
			isAdmin: !!profile?.isAdmin
		};
	},

	onAuthStateChanged(callback) {
		return fbOnAuthStateChanged(firebaseAuth, async (u) => {
			if (!u) {
				callback(null);
				return;
			}
			const profile = await getUserProfile(u.uid);
			callback({
				id: u.uid,
				email: u.email || '',
				displayName: u.displayName || (u.email ? u.email.split('@')[0] : ''),
				role: profile?.role || 'user',
				isAdmin: !!profile?.isAdmin
			});
		});
	},

	async signInWithEmailAndPassword(email, password) {
		const cred = await fbSignInWithEmailAndPassword(firebaseAuth, email, password);
		const profile = await getUserProfile(cred.user.uid);
		return {
			id: cred.user.uid,
			email: cred.user.email || '',
			displayName: cred.user.displayName || (cred.user.email ? cred.user.email.split('@')[0] : ''),
			role: profile?.role || 'user',
			isAdmin: !!profile?.isAdmin
		};
	},

	async signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const cred = await signInWithPopup(firebaseAuth, provider);
		// Ensure a profile exists
		const existing = await getUserProfile(cred.user.uid);
		if (!existing) {
			await upsertUserProfile(cred.user.uid, { role: 'user', isAdmin: false });
		}
		const profile = await getUserProfile(cred.user.uid);
		return {
			id: cred.user.uid,
			email: cred.user.email || '',
			displayName: cred.user.displayName || (cred.user.email ? cred.user.email.split('@')[0] : ''),
			role: profile?.role || 'user',
			isAdmin: !!profile?.isAdmin
		};
	},

	async signOut() {
		await fbSignOut(firebaseAuth);
	},

	async createUserWithEmailAndPassword(email, password, profile = {}) {
		const cred = await fbCreateUserWithEmailAndPassword(firebaseAuth, email, password);
		const displayName = profile.displayName || (email ? email.split('@')[0] : '');
		if (displayName) {
			try { await fbUpdateProfile(cred.user, { displayName }); } catch (_) {}
		}
		// If role is "owner", force isAdmin to true as requested
		const role = profile.role || 'user';
		const isAdmin = role === 'owner' ? true : !!profile.isAdmin;
		await upsertUserProfile(cred.user.uid, { role, isAdmin });
		return {
			id: cred.user.uid,
			email: cred.user.email || '',
			displayName,
			role,
			isAdmin
		};
	}
};

// Local Firestore-like API for cafes and reviews
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
	},

	// Reviews API
	listReviews(cafeId) {
		const reviews = readJSON('sns_reviews', []);
		return reviews.filter(r => r.cafeId === cafeId);
	},
	getReviewById(id) {
		const reviews = readJSON('sns_reviews', []);
		return reviews.find(r => r.id === id) || null;
	},
	createReview(reviewData) {
		const reviews = readJSON('sns_reviews', []);
		const review = {
			id: generateId('review'),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			helpfulCount: 0,
			...reviewData
		};
		reviews.push(review);
		writeJSON('sns_reviews', reviews);
		
		// Update cafe review count and rating
		this.updateCafeReviewStats(reviewData.cafeId);
		
		return review;
	},
	updateReview(id, updates) {
		const reviews = readJSON('sns_reviews', []);
		const index = reviews.findIndex(r => r.id === id);
		if (index === -1) throw new Error('Review not found');
		reviews[index] = { 
			...reviews[index], 
			...updates, 
			updatedAt: new Date().toISOString() 
		};
		writeJSON('sns_reviews', reviews);
		
		// Update cafe review stats
		this.updateCafeReviewStats(reviews[index].cafeId);
		
		return reviews[index];
	},
	deleteReview(id) {
		const reviews = readJSON('sns_reviews', []);
		const review = reviews.find(r => r.id === id);
		if (!review) throw new Error('Review not found');
		
		const updated = reviews.filter(r => r.id !== id);
		writeJSON('sns_reviews', updated);
		
		// Update cafe review stats
		this.updateCafeReviewStats(review.cafeId);
	},
	updateCafeReviewStats(cafeId) {
		const reviews = this.listReviews(cafeId);
		const cafe = this.getCafeById(cafeId);
		if (!cafe) return;
		
		const totalReviews = reviews.length;
		const averageRating = totalReviews > 0 
			? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
			: 0;
		
		this.updateCafe(cafeId, {
			reviews: totalReviews,
			rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
		});
	},

	// Helper function to find cafe by ID from any source
	findCafeById(cafeId, cafeServiceCafes = []) {
		// First try local storage
		const localCafe = this.getCafeById(cafeId);
		if (localCafe) return localCafe;
		
		// Then try cafe service cafes
		const serviceCafe = cafeServiceCafes.find(c => c.id === cafeId);
		if (serviceCafe) return serviceCafe;
		
		return null;
	}
};

export { firebaseAuth as firebaseAuthInstance, firestore as firestoreInstance };
export default { auth, db };


