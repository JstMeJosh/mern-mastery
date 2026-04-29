import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate();
  const handleLogout = () => {
  logout();
  navigate('/login');
};
  return (
 <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
  <div className="bg-white p-8 rounded-lg shadow w-full max-w-md text-center">
    <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard</h1>
    <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>
    
  )
}

export default Dashboard