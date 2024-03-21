import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginAPI } from '../services/authService';

interface User {
  username: string;
  balance: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: undefined,
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await loginAPI(username, password);
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    return response.user;
  } catch (error) {
    return rejectWithValue('Falha ao fazer login');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reauthenticate: (state) => {
      const accessToken = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      if (accessToken && user) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export const { reauthenticate, updateBalance  } = authSlice.actions
export default authSlice.reducer;