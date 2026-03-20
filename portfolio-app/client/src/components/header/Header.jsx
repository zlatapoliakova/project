import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center relative z-50">
      <h1 className="text-2xl font-bold text-indigo-600">Portify</h1>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="px-5 py-2 text-gray-600 font-medium hover:text-indigo-600 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          Register
        </Link>
      </div>
    </header>
  );
}

export default Header;