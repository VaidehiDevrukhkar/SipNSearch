import { Link } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'

export default function CafeCard({ cafe }) {
  return (
    <Link to={`/cafes/${cafe.id}`} className="group border rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative">
        <img className="w-full h-44 object-cover" src={cafe.photoUrl} alt={cafe.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-4 space-y-1">
        <p className="font-semibold tracking-tight">{cafe.name}</p>
        <p className="text-sm text-gray-600">{cafe.address}</p>
        <div className="text-xs text-gray-700 flex items-center gap-3 pt-1">
          <Badge>{'💲'+cafe.priceLevel}</Badge>
          <Badge tone="yellow">{'⭐ '+cafe.rating}</Badge>
        </div>
      </div>
    </Link>
  )
}

