import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// For now we'll mock product list; replace with api calls.
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  // const res = await api.get('/products');
  // return res.data;
  return [
    { id: 1, name: 'Fresh Milk 1L', category: 'milk', price: 45, image: null, top: true },
    { id: 2, name: 'Country Eggs (6)', category: 'egg', price: 60, image: null, top: true },
    { id: 3, name: 'Fresh Curd 500g', category: 'curd', price: 40, image: null, top: false },
  ];
});

const slice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default slice.reducer;
