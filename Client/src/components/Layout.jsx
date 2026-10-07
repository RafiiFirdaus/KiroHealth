import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { setUser } from '../redux/features/userSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaList, FaUserMd, FaUser } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import brandLogo from '../assets/kirohealth_logo.png';
import '../Layout.css';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // Menu untuk Pasien
  const userMenu = [
    { name: 'Beranda', path: '/', icon: <FaHome size={20} /> },
    { name: 'Riwayat Janji', path: '/appointments', icon: <FaList size={20} /> },
    { name: 'Daftar Jadi Dokter', path: '/apply-doctor', icon: <FaUserMd size={20} /> },
    { name: 'Profil', path: '/profile', icon: <FaUser size={20} /> },
  ];

  // Menu untuk Admin
  const adminMenu = [
    { name: 'Kelola Dokter', path: '/admin/doctors', icon: <FaUserMd size={20} /> },
    { name: 'Kelola Pengguna', path: '/admin/users', icon: <FaUser size={20} /> },
  ];

  // Menu untuk Dokter
  const doctorMenu = [
    { name: 'Jadwal Pasien', path: '/doctor/appointments', icon: <FaList size={20} /> },
    { name: 'Profil', path: `/doctor/profile/${user?._id}`, icon: <FaUser size={20} /> },
  ];

  // Penentu Menu Berdasarkan Role (Prioritas: Admin -> Dokter -> Pasien)
  const SidebarMenu = user?.type === 'admin' 
    ? adminMenu 
    : user?.isdoctor 
      ? doctorMenu 
      : userMenu;


  const handleLogout = () => {
    localStorage.clear(); // Hapus token
    dispatch(setUser(null)); // KOSONGKAN BRANKAS REDUX!
    navigate('/login');
  };

  return (
    <div className="main">
      <div className="sidebar">
        <div className="logo">
          <img src={brandLogo} alt="KiroHealth" />
          <div>
            <h3>KiroHealth</h3>
            <p>Modern health dashboard</p>
          </div>
        </div>
        <div className="menu">
          {/* Loop array SidebarMenu, bukan lagi userMenu */}
          {SidebarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link 
                to={menu.path} 
                className={`menu-item ${isActive ? 'active' : ''}`} 
                key={index}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                {menu.icon}
                <span style={{ marginLeft: '15px', fontSize: '1.1rem' }}>{menu.name}</span>
              </Link>
            );
          })}
          <div className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <BiLogOut size={20} />
            <span style={{ marginLeft: '15px', fontSize: '1.1rem' }}>Logout</span>
          </div>
        </div>
      </div>
      
      <div className="content">
        <div className="header">
          <div className="d-flex align-items-center gap-3">
            <div className="badge-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/notification')}>
              <IoMdNotifications size={25} />
              {user?.notification?.length > 0 && (
                  <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px', position: 'absolute', transform: 'translate(-10px, -10px)' }}>
                    {user.notification.length}
                  </span>
              )}
            </div>
            <Link 
              to={user?.isdoctor ? `/doctor/profile/${user._id}` : "/profile"} 
              className="fw-bold text-decoration-none"
            >
              {user ? user.name : 'Memuat...'}
            </Link>
          </div>
        </div>
        <div className="body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;