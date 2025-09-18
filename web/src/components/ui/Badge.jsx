export default function Badge({ tone='gray', className='', children }) {
  const map = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-emerald-100 text-emerald-800',
    blue: 'bg-blue-100 text-blue-800',
  }
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${map[tone]} ${className}`}>{children}</span>
}

