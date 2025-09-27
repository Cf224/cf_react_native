import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock create subscription
export const createSubscription = createAsyncThunk('subs/create', async (payload) => {
  // call backend to create subscription
  return { id: Math.floor(Math.random() * 10000), ...payload, status: 'active' };
});

export const fetchSubscriptions = createAsyncThunk('subs/fetch', async () => {
  return []; // replace with API fetch
});

const slice = createSlice({
  name: 'subscriptions',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default slice.reducer;
