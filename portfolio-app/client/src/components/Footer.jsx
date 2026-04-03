import { Link } from "react-router-dom";
import { Mail, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { isAuth, user, t } = useAuth();
  const userId = user?.id || user?._id;

  if (!t) return null;

  return (
    <footer className="bg-gray-900 text-gray-400 mt-20 rounded-t-[3rem] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-16">
          
          <div className="col-span-1">
            <h3 className="text-3xl font-black text-white mb-6 tracking-tighter">
              Portify<span className="text-indigo-500">.</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:text-white hover:bg-gray-700 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:text-white hover:bg-gray-700 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:text-white hover:bg-gray-700 transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                  {t.header.home} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                  {t.header.templates} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              {isAuth && (
                <li>
                  <Link to={`/profile/${userId}`} className="hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                    {t.header.myProfile} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">
              {t.footer.platform}
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {!isAuth ? (
                <>
                  <li><Link to="/login" className="hover:text-indigo-400 transition-colors">{t.header.login}</Link></li>
                  <li><Link to="/register" className="hover:text-indigo-400 transition-colors">{t.header.register}</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/settings" className="hover:text-indigo-400 transition-colors">Account Settings</Link></li>
                  <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                </>
              )}
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">
              {t.footer.contact}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Mail size={16} />
                </div>
                <span className="font-medium text-gray-300">support@portify.com</span>
              </li>
              <li className="pt-4">
                <p className="text-[11px] leading-relaxed italic opacity-60">
                  {t.footer.mission}
                </p>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">System Status</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;