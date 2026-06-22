import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_white.svg';

const redButton = "bg-[#9B0F0F] font-bold ring-2 ring-white ring-inset px-4 py-2 rounded mr-4 hover:underline"
const whiteButton = "bg-white text-[#9B0F0F] font-bold px-4 py-2 rounded hover:underline"
const Navbar = () => {
  const { user, logout } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#9B0F0F] text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-3xl font-bold">
	  <img src={logo} alt="Muser Logo" className="inline-flex w-10 h-10 -translate-y-0.5"/>
	  Muser</Link>
      <div>
        {user ? (
          <>
            {user.admin &&(
              <Link to="/admin" className={redButton}>Admin</Link>
            )}
            <Link to="/tasks" className={redButton}>Albums</Link>
            <Link to="/search" className={redButton}>Search</Link>
            <Link to="/profile" className={redButton}>Profile</Link>
            <button
              onClick={handleLogout}
              className={whiteButton}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={redButton}>Login</Link>
            <Link
              to="/register"
              className={whiteButton}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
