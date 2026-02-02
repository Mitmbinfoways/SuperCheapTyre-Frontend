import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContactInfoDetail } from '../../axios/axios';

export const fetchContactInfo = createAsyncThunk(
    'contact/fetchContactInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getContactInfoDetail();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(fetchContactInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default contactSlice.reducer;
