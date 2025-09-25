// Abstraction over Firestore with helpers for filtering/sorting
import { firestoreInstance } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import Papa from 'papaparse';

// Generate unique cafe images based on cafe name and index
function generateCafeImage(cafeName, index) {
    const cafeImages = [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center', // Coffee shop interior
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center', // Modern cafe
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop&crop=center', // Cozy cafe
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center', // Coffee cup
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center', // Outdoor cafe
        'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=400&h=300&fit=crop&crop=center', // Coffee beans
        'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=400&h=300&fit=crop&crop=center', // Coffee shop
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center', // Latte art
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop&crop=center', // Cafe counter
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop&crop=center', // Coffee shop window
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center', // Coffee shop exterior
        'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=400&h=300&fit=crop&crop=center', // Coffee shop interior 2
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center', // Latte art 2
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center', // Coffee shop interior 3
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center', // Coffee cup 2
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center', // Outdoor cafe 2
        'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=400&h=300&fit=crop&crop=center', // Coffee beans 2
        'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=400&h=300&fit=crop&crop=center', // Coffee shop 2
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center'  // Latte art 3
    ];
    
    // Use a combination of cafe name hash and index to ensure uniqueness
    const nameHash = cafeName.split('').reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    
    const imageIndex = Math.abs(nameHash + index) % cafeImages.length;
    return cafeImages[imageIndex];
}

// Generate cafe events for the current week
function generateCafeEvents(cafeName, index) {
    const eventTemplates = [
        { title: 'Coffee Tasting Workshop', type: 'workshop', duration: '2 hours' },
        { title: 'Live Music Night', type: 'entertainment', duration: '3 hours' },
        { title: 'Latte Art Class', type: 'workshop', duration: '1.5 hours' },
        { title: 'Book Reading Session', type: 'cultural', duration: '2 hours' },
        { title: 'Coffee Bean Roasting Demo', type: 'educational', duration: '1 hour' },
        { title: 'Open Mic Night', type: 'entertainment', duration: '3 hours' },
        { title: 'Barista Championship', type: 'competition', duration: '4 hours' },
        { title: 'Coffee & Dessert Pairing', type: 'tasting', duration: '1.5 hours' },
        { title: 'Morning Yoga Session', type: 'wellness', duration: '1 hour' },
        { title: 'Coffee Cupping Experience', type: 'tasting', duration: '2 hours' },
        { title: 'Art Exhibition Opening', type: 'cultural', duration: '4 hours' },
        { title: 'Coffee Brewing Masterclass', type: 'workshop', duration: '2 hours' },
        { title: 'Acoustic Music Evening', type: 'entertainment', duration: '2.5 hours' },
        { title: 'Coffee History Talk', type: 'educational', duration: '1 hour' },
        { title: 'Barista Speed Challenge', type: 'competition', duration: '2 hours' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    
    // Generate 2-4 random events for the week
    const numEvents = 2 + (index % 3); // 2-4 events
    const events = [];
    
    // Use cafe name hash for consistent event generation
    const nameHash = cafeName.split('').reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
    
    for (let i = 0; i < numEvents; i++) {
        const eventIndex = Math.abs(nameHash + index + i) % eventTemplates.length;
        const dayIndex = Math.abs(nameHash + index + i + 1) % days.length;
        const timeIndex = Math.abs(nameHash + index + i + 2) % times.length;
        
        const event = eventTemplates[eventIndex];
        const day = days[dayIndex];
        const time = times[timeIndex];
        
        events.push({
            id: `event_${index}_${i}`,
            title: event.title,
            type: event.type,
            day: day,
            time: time,
            duration: event.duration,
            description: `Join us for ${event.title.toLowerCase()} at ${cafeName}. ${event.duration} of fun and learning!`,
            cafeName: cafeName,
            date: getDateForDay(day) // Helper function to get actual date
        });
    }
    
    return events;
}

// Helper function to get actual date for the current week
function getDateForDay(dayName) {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = dayNames.indexOf(dayName);
    
    const diff = targetDay - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    return targetDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Parse amenities from CSV tags
function parseCsvAmenities(tags = '') {
    const tagsString = tags != null ? String(tags) : '';
    const tagArray = tagsString.toLowerCase().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    const amenityList = [];
    if (tagArray.some(tag => tag.includes('wifi'))) amenityList.push('wifi');
    if (tagArray.some(tag => tag.includes('parking'))) amenityList.push('parking');
    if (tagArray.some(tag => tag.includes('outdoor'))) amenityList.push('outdoor-seating');
    if (tagArray.some(tag => tag.includes('pet'))) amenityList.push('pet-friendly');
    if (tagArray.some(tag => tag.includes('vegan'))) amenityList.push('vegan-options');
    if (tagArray.some(tag => tag.includes('work'))) amenityList.push('work-friendly');
    if (tagArray.some(tag => tag.includes('family'))) amenityList.push('family-friendly');
    if (tagArray.some(tag => tag.includes('quiet'))) amenityList.push('quiet');
    if (tagArray.some(tag => tag.includes('wheelchair'))) amenityList.push('wheelchair-accessible');
    
    return amenityList;
}

// Function to fetch CSV cafes only
async function fetchCsvCafes() {
    try {
        // Prefer the extended dataset if available; fallback to filtered_cafes.csv
        let text = '';
        try {
            const resPrimary = await fetch('/Zomato_Mumbai_Extended.csv');
            if (resPrimary.ok) {
                text = await resPrimary.text();
            }
        } catch (_) {}
        if (!text) {
            const resFallback = await fetch('/filtered_cafes.csv');
            text = await resFallback.text();
        }
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        return (parsed.data || []).map((row, idx) => normalizeCafe({
            name: row.NAME,
            address: `${row.CITY}${row.REGION ? ', ' + row.REGION : ''}`.trim(),
            photoUrl: '',
            priceLevel: (() => {
                const p = Number(row.PRICE);
                if (p >= 1500) return 3; if (p >= 700) return 2; return 1;
            })(),
            rating: Number((row.RATING || '').toString().replace(/NEW/i, '0')) || 0,
            reviews: Number(row.VOTES || 0),
            hours: row.TIMING || '',
            featured: Number((row.RATING || '').toString().replace(/NEW/i, '0')) >= 4.5,
            amenities: parseCsvAmenities(row.tags || ''),
            distance: Math.random() * 5, // Generate random distance for display
            cuisine: row.cuisine_category || row.CUSINE_CATEGORY || 'Multi-cuisine',
            city: row.CITY || 'Mumbai',
            region: row.REGION || 'Downtown'
        }, `csv_${idx}`));
    } catch (_) {
        return [];
    }
}

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

    const cafeName = raw.name || 'Cafe';
    const cafeIndex = parseInt(id.replace('csv_', '')) || 0;

    return {
        id,
        name: cafeName,
        address: raw.address || '',
        image: raw.image || raw.photoUrl || generateCafeImage(cafeName, cafeIndex),
        price: raw.price || priceFromLevel(raw.priceLevel),
        amenities: Array.isArray(raw.amenities) ? raw.amenities : amenities,
        isOpen: typeof raw.isOpen === 'boolean' ? raw.isOpen : true,
        hours: raw.hours || '',
        featured: !!raw.featured,
        rating: Number(raw.rating ?? 0),
        reviews: Number(raw.reviews ?? 0),
        distance: Number(raw.distance ?? 0),
        events: raw.events || generateCafeEvents(cafeName, cafeIndex),
        cuisine: raw.cuisine || 'Multi-cuisine',
        city: raw.city || 'Mumbai',
        region: raw.region || 'Downtown',
        createdAt: raw.createdAt || null,
        createdBy: raw.createdBy || null
    };
}

export async function fetchCafes({ search = '', filters = {}, sortBy = 'distance', csvOnly = false } = {}) {
    let cafes = [];
    
    if (csvOnly) {
        // Load only CSV cafes
        cafes = await fetchCsvCafes();
    } else {
        // Load both Firebase and CSV cafes
        const snap = await getDocs(query(collection(firestoreInstance, 'cafes')));
        const firestoreCafes = snap.docs.map(d => normalizeCafe(d.data(), d.id));
        const csvCafes = await fetchCsvCafes();
        cafes = [...firestoreCafes, ...csvCafes];
    }
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


