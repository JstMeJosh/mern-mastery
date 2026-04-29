import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const VerifyOTP = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      await api.post("/auth/verify-otp", formData);
      navigate('/login')

    } catch (error) {
   if (error.response) {
    setError(error.response.data.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-4 w-full max-w-md rounded-lg shadow-md">
      <h1 className="text-2xl text-center font-bold mb-6">Verify-OTP</h1>
      {error &&<p className="text-white text-sm font-bold text-center bg-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
       <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:border-blue-500"
        />
       <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="otp"
          className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none mb-4 focus:border-blue-500"
        />
        <button className="text-center text-white w-full bg-green-500 rounded-md hover:bg-green-700 font-bold text-lg py-2">Verify</button>
      </form> 
      </div>  
    </div>
  )
}

export default VerifyOTP
