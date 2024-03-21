import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Outlet, useNavigate } from 'react-router';
import { reauthenticate } from '../store/authSlice';
import { useAppDispatch } from '../hooks';

export const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(reauthenticate());
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated, navigate]);

  if (!authChecked) {
    return <div>Checking authentication...</div>;
  }
  return <Outlet />
};
