import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function Auth({ mode }) {
  const { login, t } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsLogin(mode === "login");
    setErrors({});
  }, [mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = t.auth.validation.firstName;
    if (!isLogin && !formData.lastName.trim()) newErrors.lastName = t.auth.validation.lastName;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = t.auth.validation.email;
    
    if (formData.password.length < 5) newErrors.password = t.auth.validation.password;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
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
        const userId = data.user._id || data.user.id;
        login(data.user, data.token);
        navigate(`/profile/${userId}`);
      } else {
        setErrors({ server: data.message || t.auth.validation.authFailed });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ server: t.auth.validation.serverError });
    } finally {
      setLoading(false);
    }
  };

  if (!t) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
        <h1
          className="text-3xl font-black text-center mb-2 text-indigo-600 cursor-pointer tracking-tighter"
          onClick={() => navigate("/")}
        >
          Portify<span className="text-gray-900">.</span>
        </h1>

        <h2 className="text-lg font-bold text-center mb-8 text-gray-500 uppercase tracking-widest text-[10px]">
          {isLogin ? t.auth.welcome : t.auth.journey}
        </h2>

        {errors.server && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center">
            {errors.server}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.auth.firstName}</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full border px-4 py-3 rounded-2xl outline-none text-sm transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.auth.lastName}</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full border px-4 py-3 rounded-2xl outline-none text-sm transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'}`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.auth.email}</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className={`w-full border px-4 py-3 rounded-2xl outline-none text-sm transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'}`}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{t.auth.password}</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full border px-4 py-3 rounded-2xl outline-none text-sm transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'}`}
            />
            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 mt-4 flex items-center justify-center gap-2 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.auth.processing}
              </>
            ) : (
              isLogin ? t.auth.loginBtn : t.auth.registerBtn
            )}
          </button>
        </form>

        <p className="text-center text-[11px] font-bold mt-10 text-gray-400 uppercase tracking-widest">
          {isLogin ? t.auth.newTo : t.auth.alreadyMember}
          <span
            className="text-indigo-600 ml-2 cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? t.auth.joinNow : t.auth.loginHere}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;