import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import login from "../assets/logo2.png";
import { motion } from "framer-motion";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("/auth/login", { email, password });
            console.log("Login berhasil, token:", response.data.token);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err.response?.data?.message);
            setError(err.response?.data?.message || "Login gagal!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Login | DSF Digital Agency"; // Ganti dengan title yang diinginkan
    }, []);

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 px-4 md:px-0">
            <motion.div 
                className="flex flex-col md:flex-row items-center w-full max-w-5xl rounded-lg p-6 md:p-10 bg-white gap-6 md:gap-10 shadow-2xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Bagian kiri */}
                <div className="w-full md:w-1/2 text-center md:text-left p-4 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Login to</h2>
                    <p className="text-xl md:text-2xl font-semibold text-gray-700 mt-2">DSF Digital Agency</p>
                    <p className="text-base md:text-lg text-gray-600 mt-2">
                        #Solusi Digital Marketing untuk{" "}
                        <span className="text-orange-500 font-semibold">UMKM</span> &{" "}
                        <span className="text-orange-500 font-semibold">Bisnis Berkembang</span>
                    </p>
                    <motion.img 
                        src={login} 
                        alt="Login" 
                        className="w-40 md:w-64 mx-auto md:mx-0 mt-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                </div>
    
                {/* Form login */}
                <div className="w-full md:w-1/2 p-6 md:p-10 border-2 rounded-lg shadow-lg bg-white" style={{ borderColor: '#FFA559' }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
                    {error && <p className="text-red-500 text-center mb-4 text-base md:text-lg">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <input
                                type="email"
                                className="w-full p-3 md:p-4 border-2 rounded-lg bg-orange-50 focus:ring-4 focus:ring-orange-300 text-base md:text-lg transition-all duration-300 focus:border-orange-500 text-gray-800 placeholder-gray-500"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 md:p-4 border-2 rounded-lg bg-orange-50 focus:ring-4 focus:ring-orange-300 text-base md:text-lg transition-all duration-300 focus:border-orange-500 text-gray-800 placeholder-gray-500"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg md:text-xl flex items-center hover:text-orange-500 transition-colors duration-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <motion.button
                            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 md:p-4 rounded-lg text-base md:text-lg font-semibold transition-all duration-300 shadow-lg mt-4 md:mt-6 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-orange-700'}`}
                            whileHover={!loading ? { scale: 1.05 } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                            disabled={loading}
                        >
                            {loading && (
                                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            {loading ? 'Loading...' : 'Login'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;