import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchReport } from '../services/apiService';
import { Report } from '../types';

interface ReportState {
  report: Report | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReportState = {
  report: null,
  status: 'idle',
  error: null,
};

export const fetchReportAsync = createAsyncThunk(
  'report/fetchReport',
  async (timeFrame: string='24h') => {
    const response = await fetchReport(timeFrame);
    return response;
  }
);

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReportAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReportAsync.fulfilled, (state, action: PayloadAction<Report>) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(fetchReportAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const selectReport = (state: RootState) => state.report.report;
export const  selectReportStatus = (state: RootState) => state.report.status;

export default reportSlice.reducer;
