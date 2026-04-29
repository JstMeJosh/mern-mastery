import { useNavigate , useParams, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const { token } = useParams();
    const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true)
    setError("")
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login')
      setLoading(false)
    } catch (error) {
    const data = error.response.data;
    if (data.errors) {
        setError(data.errors[0]);
    } else {
        setError(data.message);
    }
    setLoading(false)
}
  };
  const handleChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white w-full max-w-md p-4">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-bold text-2xl mb-4 text-gray-700">
            Reset Password
          </h1>
          {error && (
            <p className="p-4 bg-red-500 text-center text-md mb-4 text-white font-bold">
              {error}
            </p>
          )}
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-700"
            value={password}
            onChange={handleChange}
            placeholder="Your new Password"
          />
          <button className="bg-green-500 hover:bg-green-700 w-full text-white mb-4 text-center font-bold text-xl" disabled={loading}>Submit</button>
          <p className="text-center text-gray-500 font-bold">Remember password ? <Link to="/login" className="hover:underline py-2 text-blue-300 hover:text-blue-500 text-md">Login</Link></p>
        {loading && (
            <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
