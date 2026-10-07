import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Fungsi untuk mengambil data user
  const getUser = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/getUserData',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        // Simpan data ke brankas Redux
        dispatch(setUser(res.data.data)); 
      } else {
        localStorage.clear();
      }
    } catch (error) {
      localStorage.clear();
      console.log(error);
    }
  };

  // Cek apakah data user sudah ada di Redux, jika belum maka panggil fungsi
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem('token')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}