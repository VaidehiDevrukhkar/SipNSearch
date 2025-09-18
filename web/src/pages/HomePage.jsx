import Hero from '../components/home/Hero.jsx'
import QuickSearch from '../components/home/QuickSearch.jsx'
import TrendingCafes from '../components/home/TrendingCafes.jsx'
import MapPreview from '../components/map/MapPreview.jsx'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <Hero />
      <QuickSearch />
      <TrendingCafes />
      <MapPreview />
    </div>
  )
}

