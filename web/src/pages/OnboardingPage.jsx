import Button from '../components/ui/Button.jsx'
import { useUser } from '../state/UserContext.jsx'

export default function OnboardingPage() {
  const { setRole } = useUser()
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="border rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">Choose your role</h1>
        <p className="text-gray-600">Pick how you’ll use SipNSearch. You can change later.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Button onClick={() => setRole('user')}>User</Button>
          <Button variant="secondary" onClick={() => setRole('owner')}>Owner</Button>
        </div>
      </div>
    </div>
  )
}

