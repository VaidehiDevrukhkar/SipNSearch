// Placeholder interactive map panel and density heatmap stub
export default function MapView({ cafes }) {
  return (
    <div className="w-full h-full rounded border bg-white p-3 text-sm text-gray-600">
      Map with {cafes?.length || 0} cafes and heatmap here.
    </div>
  )
}

