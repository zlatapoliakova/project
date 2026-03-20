import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Portify</h3>
            <p className="text-sm leading-relaxed">
              Найкращий інструмент для дизайнерів, щоб створити вражаюче цифрове портфоліо за лічені хвилини.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-indigo-400 transition-colors">Templates</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors">My Profile</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Account</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">Register</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-indigo-400 transition-colors">Settings</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-500" />
                <span>support@portify.com</span>
              </li>
              <li className="pt-2 text-xs leading-relaxed">
                Створено як дипломний проєкт для дизайнерів та розробників.
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
          <p>© 2026 Portify. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;