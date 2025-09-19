// Abstraction over Firestore with helpers for filtering/sorting
import { firestoreInstance } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import Papa from 'papaparse';

function normalizeCafe(raw, id) {
    // Support two shapes:
    // 1) New UI shape { name, address, image, price, amenities[], isOpen, hours, featured, rating, reviews, distance }
    // 2) Admin/manual Firestore shape { name, address, photoUrl, priceLevel(1-3), ecoFriendly, outdoorSeating, petFriendly, wifiSpeed, studentDiscount, rating }
    const priceFromLevel = (level) => {
        if (level === 3 || level === '3') return '$$$';
        if (level === 2 || level === '2') return '$$';
        if (level === 1 || level === '1') return '$';
        return raw.price || '$$';
    };

    const amenities = Array.isArray(raw.amenities) ? raw.amenities : (() => {
        const list = [];
        if (raw.ecoFriendly) list.push('eco-friendly');
        if (raw.outdoorSeating) list.push('outdoor-seating');
        if (raw.petFriendly) list.push('pet-friendly');
        if (raw.wifiSpeed) list.push('wifi');
        if (raw.studentDiscount) list.push('student-discount');
        return list;
    })();

    return {
        id,
        name: raw.name || 'Cafe',
        address: raw.address || '',
        image: raw.image || raw.photoUrl || '',
        price: raw.price || priceFromLevel(raw.priceLevel),
        amenities,
        isOpen: typeof raw.isOpen === 'boolean' ? raw.isOpen : true,
        hours: raw.hours || '',
        featured: !!raw.featured,
        rating: Number(raw.rating ?? 0),
        reviews: Number(raw.reviews ?? 0),
        distance: Number(raw.distance ?? 0),
        createdAt: raw.createdAt || null,
        createdBy: raw.createdBy || null
    };
}

export async function fetchCafes({ search = '', filters = {}, sortBy = 'distance' } = {}) {
    const snap = await getDocs(query(collection(firestoreInstance, 'cafes')));
    const firestoreCafes = snap.docs.map(d => normalizeCafe(d.data(), d.id));

    // Load CSV cafes from public file
    let csvCafes = [];
    try {
        const res = await fetch('/filtered_cafes.csv');
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        csvCafes = (parsed.data || []).map((row, idx) => normalizeCafe({
            name: row.NAME,
            address: `${row.CITY}${row.REGION ? ', ' + row.REGION : ''}`.trim(),
            photoUrl: '',
            priceLevel: (() => {
                const p = Number(row.PRICE);
                if (p >= 1500) return 3; if (p >= 700) return 2; return 1;
            })(),
            rating: Number((row.RATING || '').replace(/NEW/i, '0')) || 0,
            reviews: Number(row.VOTES || 0),
            hours: row.TIMING || '',
            featured: false,
            amenities: [],
            distance: 0
        }, `csv_${idx}`));
    } catch (_) {
        // ignore CSV errors
    }

    const cafes = [...firestoreCafes, ...csvCafes];
	let results = cafes;

	if (search) {
		const term = search.toLowerCase();
		results = results.filter(c =>
			c.name.toLowerCase().includes(term) ||
			c.address.toLowerCase().includes(term) ||
			Array.isArray(c.amenities) && c.amenities.some(a => a.toLowerCase().includes(term))
		);
	}

    if (filters) {
		if (filters.price) results = results.filter(c => c.price === filters.price);
		if (filters.rating) results = results.filter(c => Number(c.rating) >= Number(filters.rating));
		if (filters.amenity) results = results.filter(c => Array.isArray(c.amenities) && c.amenities.includes(filters.amenity));
		if (filters.status === 'open') results = results.filter(c => !!c.isOpen);
        // Only cafes posted by admins
        if (filters.onlyAdminPosted) results = results.filter(c => !!c?.createdBy?.isAdmin);
	}

	switch (sortBy) {
		case 'rating':
			results = [...results].sort((a, b) => Number(b.rating) - Number(a.rating));
			break;
		case 'reviews':
			results = [...results].sort((a, b) => Number(b.reviews) - Number(a.reviews));
			break;
		case 'name':
			results = [...results].sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'distance':
		default:
			results = [...results].sort((a, b) => Number(a.distance ?? 0) - Number(b.distance ?? 0));
	}

	return results;
}

export async function createCafe(data) {
    const ref = await addDoc(collection(firestoreInstance, 'cafes'), data);
    const snapshot = await getDoc(ref);
    return normalizeCafe(snapshot.data(), snapshot.id);
}

export async function updateCafe(id, updates) {
    await updateDoc(doc(firestoreInstance, 'cafes', id), updates);
    const snapshot = await getDoc(doc(firestoreInstance, 'cafes', id));
    return normalizeCafe(snapshot.data(), snapshot.id);
}

export async function deleteCafe(id) {
	await deleteDoc(doc(firestoreInstance, 'cafes', id));
	return true;
}

export async function getCafeById(id) {
    const snapshot = await getDoc(doc(firestoreInstance, 'cafes', id));
    return snapshot.exists() ? normalizeCafe(snapshot.data(), snapshot.id) : null;
}


