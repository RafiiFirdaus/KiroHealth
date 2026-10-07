import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fungsi memanggil API daftar pengguna
  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <h3 className="mb-4">Kelola Pengguna</h3>
      <div className="card shadow-sm p-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {/* Menentukan label role berdasarkan data isdoctor dan type */}
                  {user.isdoctor ? 'Dokter' : user.type === 'admin' ? 'Admin' : 'Pasien'}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm">Blokir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Users;