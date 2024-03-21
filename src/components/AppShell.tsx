import { AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, styled, Paper, Divider, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../hooks';
import { logoutUser } from '../store/authSlice';

const AppShellBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

export const AppShell: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logout = () => {
    dispatch(logoutUser())
  }

  const navigateTo = (path: string) => {
    navigate(path)
  }
  return (
    <AppShellBox
      sx={{
        backgroundColor: '#F7F7FF'
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Venda Mais Transactions
          </Typography>

          {isAuthenticated && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>

      </AppBar>
    { isAuthenticated &&  <Paper
        elevation={2}
        sx={{
          overflowX: 'hidden',
          marginTop: 12, 
          marginLeft: 2, 
          marginBottom: 20,
          borderRadius: '8px',
          height: 350,
          px: 1
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }, 
              { text: 'Transactions', icon: <ReceiptLongIcon />, path: '/transactions' },
            ].map((item, index) => (
              <div key={index}>
                <ListItem sx={{ py:2 }} onClick={() => navigateTo(item.path)} button key={item.text}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
                  <Divider variant='middle'/>
              </div>
            ))}
          </List>
        </Box>
      </Paper>}
      <MainContent>
        <Toolbar />
        <Outlet />
      </MainContent>
    </AppShellBox>
  );
};
