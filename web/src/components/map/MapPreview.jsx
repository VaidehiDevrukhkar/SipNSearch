// Placeholder map preview. Replace with Google Maps / Mapbox later.
export default function MapPreview({ cafe }) {
  if (!cafe) return (
    <div className="rounded border bg-white p-3 text-sm text-gray-600">Map preview will appear here.</div>
  )
  return (
    <div className="rounded border bg-white p-3 text-sm text-gray-600">
      Map: {cafe.lat}, {cafe.lng}
    </div>
  )
}

