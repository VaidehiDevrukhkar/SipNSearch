export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-600">
        <div>
          <p className="font-semibold text-gray-900">SipNSearch</p>
          <p className="mt-2">Discover cafes by mood, amenities, and community vibes.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Product</p>
            <a className="block hover:underline" href="#">Explore</a>
            <a className="block hover:underline" href="#">Lists</a>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Company</p>
            <a className="block hover:underline" href="#">Privacy</a>
            <a className="block hover:underline" href="#">Terms</a>
          </div>
        </div>
        <div className="flex items-end justify-between sm:col-span-2 lg:col-span-1">
          <p>© {new Date().getFullYear()} SipNSearch</p>
        </div>
      </div>
    </footer>
  )
}

