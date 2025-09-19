import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Shield, Coffee, Star, MapPin } from 'lucide-react';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { useCafes, CafeProvider } from '../context/CafeContext';

function AdminPanelInner() {
    const { isAdmin, login, error } = useAuth();
    const { cafes, addCafe, editCafe, removeCafe } = useCafes();
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState({ name: '', address: '', price: '$$', rating: 0, reviews: 0, distance: 0, image: '', amenities: '', isOpen: true, hours: '', featured: false });
	const [search, setSearch] = useState('');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [authLoading, setAuthLoading] = useState(false);

	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		return cafes.filter(c => c.name.toLowerCase().includes(term) || c.address.toLowerCase().includes(term));
	}, [cafes, search]);

	if (!isAdmin) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
				<div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
					<Shield className="h-12 w-12 text-rose-500 mx-auto mb-4" />
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
                    <p className="text-gray-600 mb-4">You need admin privileges to view this page.</p>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setAuthLoading(true);
                            try {
                                await login(authForm.email, authForm.password);
                            } finally {
                                setAuthLoading(false);
                            }
                        }}
                        className="space-y-3 text-left"
                    >
                        <input
                            type="email"
                            placeholder="Admin email"
                            value={authForm.email}
                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                        {error && <div className="text-sm text-rose-600">{error}</div>}
                        <button disabled={authLoading} className="w-full px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800">
                            {authLoading ? 'Signing in...' : 'Sign in as Admin'}
                        </button>
                        <p className="text-xs text-gray-500">Use an admin account to proceed</p>
                    </form>
				</div>
			</div>
		);
	}

	function startCreate() {
		setEditingId('new');
		setForm({ name: '', address: '', price: '$$', rating: 0, reviews: 0, distance: 0, image: '', amenities: '', isOpen: true, hours: '', featured: false });
	}

	function startEdit(cafe) {
		setEditingId(cafe.id);
		setForm({ ...cafe, amenities: Array.isArray(cafe.amenities) ? cafe.amenities.join(', ') : '' });
	}

	function cancelEdit() {
		setEditingId(null);
	}

	async function submitForm(e) {
		e.preventDefault();
		const payload = {
			...form,
			rating: Number(form.rating) || 0,
			reviews: Number(form.reviews) || 0,
			distance: Number(form.distance) || 0,
			amenities: String(form.amenities).split(',').map(a => a.trim()).filter(Boolean),
			isOpen: !!form.isOpen,
			featured: !!form.featured
		};
		if (editingId === 'new') {
			await addCafe(payload);
		} else if (editingId) {
			await editCafe(editingId, payload);
		}
		setEditingId(null);
	}

	async function handleDelete(id) {
		if (confirm('Delete this cafe?')) {
			await removeCafe(id);
		}
	}

    return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
					<button onClick={startCreate} className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800">
						<Plus className="h-4 w-4 mr-2" /> Add Cafe
					</button>
				</div>

				<div className="bg-white rounded-lg shadow p-4 mb-6">
					<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cafes by name or address" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
				</div>

				<div className="grid gap-4">
					{filtered.map(cafe => (
						<div key={cafe.id} className="bg-white rounded-lg shadow p-4">
							<div className="flex items-start justify-between">
								<div className="flex items-start space-x-4">
									<img src={cafe.image} alt={cafe.name} className="w-20 h-20 object-cover rounded" />
									<div>
										<h3 className="text-lg font-semibold text-gray-900 flex items-center">
											<Coffee className="h-4 w-4 text-teal-600 mr-2" /> {cafe.name}
										</h3>
										<p className="text-sm text-gray-600 flex items-center"><MapPin className="h-4 w-4 mr-1" /> {cafe.address}</p>
										<div className="text-sm text-gray-600 flex items-center"><Star className="h-4 w-4 text-yellow-400 mr-1" /> {cafe.rating} · {cafe.reviews} reviews · {cafe.price} · {cafe.isOpen ? 'Open' : 'Closed'}</div>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<button onClick={() => startEdit(cafe)} className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 inline-flex items-center"><Pencil className="h-4 w-4 mr-1" /> Edit</button>
									<button onClick={() => handleDelete(cafe.id)} className="px-3 py-2 text-sm bg-rose-100 text-rose-700 rounded hover:bg-rose-200 inline-flex items-center"><Trash2 className="h-4 w-4 mr-1" /> Delete</button>
								</div>
							</div>
							{editingId === cafe.id && (
								<form onSubmit={submitForm} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
									<input className="px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
									<input className="px-3 py-2 border rounded" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
									<input className="px-3 py-2 border rounded" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
									<input className="px-3 py-2 border rounded" placeholder="Price ($, $$, $$$)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
									<input type="number" step="0.1" className="px-3 py-2 border rounded" placeholder="Rating" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
									<input type="number" className="px-3 py-2 border rounded" placeholder="Reviews" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} />
									<input type="number" className="px-3 py-2 border rounded" placeholder="Distance (km)" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} />
									<input className="px-3 py-2 border rounded" placeholder="Hours" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
									<input className="px-3 py-2 border rounded md:col-span-2" placeholder="Amenities (comma separated)" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} />
									<label className="flex items-center space-x-2"><input type="checkbox" checked={!!form.isOpen} onChange={e => setForm({ ...form, isOpen: e.target.checked })} /><span>Open</span></label>
									<label className="flex items-center space-x-2"><input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /><span>Featured</span></label>
									<div className="md:col-span-2 flex space-x-2">
										<button type="submit" className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"><Save className="h-4 w-4 mr-1" /> Save</button>
										<button type="button" onClick={cancelEdit} className="inline-flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"><X className="h-4 w-4 mr-1" /> Cancel</button>
									</div>
								</form>
							)}
						</div>
					))}

					{editingId === 'new' && (
						<div className="bg-white rounded-lg shadow p-4">
							<h3 className="text-lg font-semibold mb-4">Create New Cafe</h3>
							<form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input className="px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
								<input className="px-3 py-2 border rounded" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
								<input className="px-3 py-2 border rounded" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
								<input className="px-3 py-2 border rounded" placeholder="Price ($, $$, $$$)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
								<input type="number" step="0.1" className="px-3 py-2 border rounded" placeholder="Rating" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
								<input type="number" className="px-3 py-2 border rounded" placeholder="Reviews" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} />
								<input type="number" className="px-3 py-2 border rounded" placeholder="Distance (km)" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} />
								<input className="px-3 py-2 border rounded" placeholder="Hours" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
								<input className="px-3 py-2 border rounded md:col-span-2" placeholder="Amenities (comma separated)" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} />
								<label className="flex items-center space-x-2"><input type="checkbox" checked={!!form.isOpen} onChange={e => setForm({ ...form, isOpen: e.target.checked })} /><span>Open</span></label>
								<label className="flex items-center space-x-2"><input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /><span>Featured</span></label>
								<div className="md:col-span-2 flex space-x-2">
									<button type="submit" className="inline-flex items-center px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"><Save className="h-4 w-4 mr-1" /> Create</button>
									<button type="button" onClick={cancelEdit} className="inline-flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"><X className="h-4 w-4 mr-1" /> Cancel</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function AdminPanel() {
    return (
        <AuthProvider>
            <CafeProvider>
                <AdminPanelInner />
            </CafeProvider>
        </AuthProvider>
    );
}


