import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    

    const userData = response.data.data; 

    
    localStorage.setItem("token", userData.token);

 
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })
    );

    

    navigate("/dashboard");

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    setMessage("Login failed");
  }finally{
    setLoading(false);
  }


  };
return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

    
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900"></div>

    
    <div className="absolute w-72 h-72 bg-black-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob top-10 left-10"></div>
    <div className="absolute w-72 h-72 bg-grey-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 bottom-10 right-10"></div>

    
    <div className="relative z-10 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-2xl">

      <h2 className="text-4xl font-bold text-center mb-2 tracking-tight">
        Welcome Back!
      </h2>

      <p className="text-gray-300 text-center mb-8 text-sm">
        Login to continue your journey.
      </p>

      <form onSubmit={handleLogin} className="space-y-6">

        
        <input
          type="email"
          required
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 cursor-pointer text-gray-300 hover:text-white transition"
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

       
        {message && (
          <div className="p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-xl text-sm">
            {message}
          </div>
        )}

        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/40 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

      </form>

      <p className="text-center text-sm text-gray-300 mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="underline cursor-pointer hover:text-white transition"
        >
          Register
        </span>
      </p>

    </div>
  </div>
);

}

export default Login;
