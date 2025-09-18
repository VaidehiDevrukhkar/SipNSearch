export default function Select(props) {
  return (
    <select className={`border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.className||''}`} {...props} />
  )
}

