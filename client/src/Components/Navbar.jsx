import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiLight } from "react-icons/ci";
import { MdOutlineNightsStay } from "react-icons/md";
import { Link } from "react-router-dom";


const Navbar = () => {


  const {  i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); 



  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
   

    useEffect(() => {
      // Apply the saved theme or default to 'light' if not found
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Toggle between dark and light mode and save to localStorage
    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme); // Store theme in localStorage
      document.documentElement.setAttribute('data-theme', newTheme);
    };
  

    return (
        <div className="navbar bg-base-100 px-20">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><Link to="/iiuc">iiuc</Link></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/iiuc">iiuc</Link></li>
            <li><Link to="/quiz">quiz</Link></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
            <li><a>Item 3</a>
            </li>

            
            <li>              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 border-2 mr-4 transform transition-all duration-300 ease-in-out ${
                  i18n.language === 'en'
                    ? 'bg-black text-white scale-110'
                    : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                English
              </button>
              </li>
           
           
            <li>   <button
                onClick={() => changeLanguage('bn')}
                className={`px-3 py-1 border-2 transform transition-all duration-300 ease-in-out ${
                  i18n.language === 'bn'
                    ? 'bg-black text-white scale-110'
                    : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                বাংলা
              </button>
              </li>


            <li className="ms-4">               {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-2 py-2  text-white rounded-md transition-all duration-300 ease-in-out btn-ghost"
            >
               {theme === 'light' ? <CiLight className="text-2xl text-slate-900 " />
                          : <MdOutlineNightsStay className="text-2xl text-white " />
} 
            </button>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Button</a>
        </div>
      </div>
    );
};

export default Navbar;