import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(response.data.message);
      setError("");
      setLoading(false)
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        setSuccess("");
        setLoading(false)
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false)
      }
    }
  };
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white w-full max-w-md p-4">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-bold text-2xl mb-4 text-gray-700">
            Forgot Password
          </h1>
          {error && (
            <p className="p-4 bg-red-500 text-center text-md mb-4 text-white font-bold">
              {error}
            </p>
          )}
          {success && (
            <p className="p-4 bg-green-500 text-center text-md mb-4 text-white font-bold">
              {success}
            </p>
          )}
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-700"
            value={email}
            onChange={handleChange}
            placeholder="Your email"
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

export default ForgotPassword;
