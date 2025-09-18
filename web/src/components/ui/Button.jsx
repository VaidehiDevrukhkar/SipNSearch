export default function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-900 text-white hover:bg-black/90 focus:ring-gray-900',
    subtle: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

