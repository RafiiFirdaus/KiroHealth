import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Doctors from './pages/admin/Doctors';
import Users from './pages/admin/Users';
import ApplyDoctor from './pages/ApplyDoctor';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotificationPage from './pages/NotificationPage';
import BookAppointment from './pages/BookAppointment';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import Appointments from './pages/Appointments';
import Profile from './pages/doctor/Profile';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <ProtectedRoute><Home /></ProtectedRoute> } />
        
        {/* Tambahkan Rute Apply Doctor di sini */}
        <Route path="/apply-doctor" element={ <ProtectedRoute><ApplyDoctor /></ProtectedRoute> } />
        <Route path="/admin/doctors" element={ <ProtectedRoute><Doctors /></ProtectedRoute> } />
        <Route path="/admin/users" element={ <ProtectedRoute><Users /></ProtectedRoute> } />
        <Route path="/appointments" element={ <ProtectedRoute><Appointments /></ProtectedRoute> } />
        <Route path="/doctor/profile/:id" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
        <Route path="/profile" element={ <ProtectedRoute><UserProfile /></ProtectedRoute> } />
        <Route path="/register" element={ <PublicRoute><Register /></PublicRoute> } />
        <Route path="/login" element={ <PublicRoute><Login /></PublicRoute> } />
        <Route path="/doctor/appointments" element={ <ProtectedRoute><DoctorAppointments /></ProtectedRoute> } />
        <Route path="/book-appointment/:doctorId" element={ <ProtectedRoute><BookAppointment /></ProtectedRoute> } />
        <Route path="/notification" element={ <ProtectedRoute><NotificationPage /></ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;