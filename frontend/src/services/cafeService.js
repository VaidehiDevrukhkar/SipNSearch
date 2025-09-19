// Abstraction over our local mock db with helpers for filtering/sorting
import { db } from './firebase';

export async function fetchCafes({ search = '', filters = {}, sortBy = 'distance' } = {}) {
	const cafes = db.listCafes();
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
	return db.createCafe(data);
}

export async function updateCafe(id, updates) {
	return db.updateCafe(id, updates);
}

export async function deleteCafe(id) {
	db.deleteCafe(id);
	return true;
}

export async function getCafeById(id) {
	return db.getCafeById(id);
}


