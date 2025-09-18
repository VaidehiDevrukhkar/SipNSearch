import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-rose-500 to-orange-300">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 0, transparent 50%), radial-gradient(circle at 80% 0%, white 0, transparent 40%)'}} />
      <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-1 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Find your perfect cafe</h1>
          <p className="mt-3 text-white/90 max-w-xl">Search by mood, amenities, and more. Save favorites, share lists, and see what’s trending.</p>
          <Link to="/cafes" className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-lg bg-white/95 text-gray-900 font-medium shadow hover:bg-white">Explore Cafes<span>→</span></Link>
        </div>
        <img className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-xl shadow-2xl ring-1 ring-white/30" src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop" alt="Cafe" />
      </div>
    </section>
  )
}

