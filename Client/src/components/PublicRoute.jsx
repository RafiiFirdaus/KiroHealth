import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  // Jika sudah punya token, cegah akses ke halaman publik dan lempar ke dasbor
  if (localStorage.getItem('token')) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}