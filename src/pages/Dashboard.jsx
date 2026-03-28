import PasswordGate from '../components/PasswordGate'
import DashboardLayout from '../components/DashboardLayout'

export default function Dashboard() {
  return (
    <PasswordGate>
      <DashboardLayout />
    </PasswordGate>
  )
}
