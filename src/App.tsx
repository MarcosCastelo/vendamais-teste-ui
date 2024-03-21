import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { useAppDispatch } from './hooks';
import { logoutUser, reauthenticate } from './store/authSlice'
import { tokenIsValid } from './utils/jwtExpiration';
import { AppShell } from './components/AppShell';
import Transactions from './components/Transactions';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (tokenIsValid()) {
      dispatch(reauthenticate())
    } else {
      dispatch(logoutUser())
    }
  }, [dispatch])
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route element={<PrivateRoute/>}>
            <Route path="/" Component={Dashboard} />
            <Route path='/transactions' Component={Transactions}></Route>
            <Route path='/dashboard' Component={Dashboard}></Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;