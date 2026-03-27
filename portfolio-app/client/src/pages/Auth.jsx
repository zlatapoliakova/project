import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Auth({ mode }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: isLogin ? undefined : `${formData.name} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.user.id || data.user._id;

        login(data.user, data.token);

        navigate(`/profile/${userId}`);
        
      } else {
        alert(data.message || "Помилка авторизації");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Сервер не відповідає");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1
          className="text-3xl font-bold text-center mb-6 text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Portify
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 ml-1">First Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 ml-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 mt-2"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-8 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-indigo-600 font-bold ml-2 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;