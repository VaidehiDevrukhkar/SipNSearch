import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import CafeCard from '../components/CafeCard';
import { useCafes } from '../context/CafeContext';
import { Filter, Grid, Map, Star } from 'lucide-react';

export default function Browse() {
    const { cafes, load } = useCafes();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ price: '', rating: '', amenity: '', status: '' });
    const [sortBy, setSortBy] = useState('rating');
    const [view, setView] = useState('list');

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        let list = cafes || [];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.address.toLowerCase().includes(term) ||
                (Array.isArray(c.amenities) && c.amenities.some(a => a.toLowerCase().includes(term)))
            );
        }
        if (filters.price) list = list.filter(c => c.price === filters.price);
        if (filters.rating) list = list.filter(c => Number(c.rating) >= Number(filters.rating));
        if (filters.amenity) list = list.filter(c => Array.isArray(c.amenities) && c.amenities.includes(filters.amenity));
        if (filters.status === 'open') list = list.filter(c => !!c.isOpen);

        switch (sortBy) {
            case 'rating':
                list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
                break;
            case 'reviews':
                list = [...list].sort((a, b) => Number(b.reviews) - Number(a.reviews));
                break;
            case 'name':
                list = [...list].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'distance':
            default:
                list = [...list].sort((a, b) => Number(a.distance ?? 0) - Number(b.distance ?? 0));
        }

        return list;
    }, [cafes, searchTerm, filters, sortBy]);

    const visible = useMemo(() => filtered.slice(0, 30), [filtered]);

    return (
        <div className="min-h-screen bg-rose-50">
            <Navbar />

            <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4 overflow-x-auto">
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <span className="font-medium text-gray-700 hidden md:inline">Filters:</span>
                            </div>

                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search cafes or locations..."
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            />

                            <select
                                value={filters.price}
                                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">All Prices</option>
                                <option value="$">$ - Budget</option>
                                <option value="$$">$$ - Moderate</option>
                                <option value="$$$">$$$ - Premium</option>
                            </select>

                            <select
                                value={filters.rating}
                                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">All Ratings</option>
                                <option value="4.5">4.5+ Stars</option>
                                <option value="4.0">4.0+ Stars</option>
                                <option value="3.5">3.5+ Stars</option>
                            </select>

                            <select
                                value={filters.amenity}
                                onChange={(e) => setFilters({ ...filters, amenity: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">All Amenities</option>
                                <option value="wifi">WiFi</option>
                                <option value="pet-friendly">Pet Friendly</option>
                                <option value="outdoor-seating">Outdoor Seating</option>
                                <option value="vegan-friendly">Vegan Options</option>
                                <option value="quiet">Quiet Environment</option>
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">Open & Closed</option>
                                <option value="open">Open Now</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between md:justify-end space-x-4">
                            <div className="text-sm text-gray-600">{filtered.length} cafes found</div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                            >
                                <option value="rating">Sort by Rating</option>
                                <option value="reviews">Sort by Reviews</option>
                                <option value="distance">Sort by Distance</option>
                                <option value="name">Sort by Name</option>
                            </select>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="List View"
                                >
                                    <Grid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setView('map')}
                                    className={`p-2 rounded-lg transition-colors ${view === 'map' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="Map View"
                                >
                                    <Map className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Top Cafes</h1>
                    <p className="text-gray-600">Showing top 30 results by rating</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visible.map(cafe => (
                        <CafeCard key={cafe.id} cafe={cafe} />
                    ))}
                </div>

                {visible.length === 0 && (
                    <div className="text-center py-16">
                        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No cafes found</h3>
                        <p className="text-gray-600">Try adjusting filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
}



