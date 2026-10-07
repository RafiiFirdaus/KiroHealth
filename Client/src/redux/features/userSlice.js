import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null, // Kondisi awal: belum ada data user
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Memasukkan data ke dalam state
    },
  },
});

export const { setUser } = userSlice.actions;