export default function Card({ className = '', children }) {
  return (
    <div className={`border rounded-2xl bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

