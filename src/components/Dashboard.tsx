import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, Button, Box } from '@mui/material';
import { RootState } from '../store/store';
import { useAppDispatch } from '../hooks';
import { fetchReportAsync, selectReport, selectReportStatus } from '../store/reportSlice';
import { useNavigate } from 'react-router';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import DepositDialog from './Dialogs/DepositDialog';
import WithdrawDialog from './Dialogs/WithdrawDialog';
import TransferDialog from './Dialogs/TransferDialog';
import { updateBalance } from '../store/authSlice';
import { Transaction } from '../types';


const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const report = useSelector(selectReport)
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reportStatus = useSelector(selectReportStatus)
  const navigate = useNavigate()

  const [isDepositOpen, setDepositOpen] = useState(false)
  const [isWithdrawOpen, setWithdrawOpen] = useState(false)
  const [isTransferOpen, setTransferOpen] = useState(false)

  useEffect(() => {
    if (reportStatus === 'idle') {
      dispatch(fetchReportAsync('24h'));
    }
  }, [isAuthenticated, reportStatus, navigate, dispatch])

  if (reportStatus !== 'succeeded') {
    return <div></div>;
  }

  const handleOpenDeposit = () => setDepositOpen(true);
  const handleOpenWithdraw = () => setWithdrawOpen(true);
  const handleOpenTransfer = () => setTransferOpen(true);

  const handleClose = () => {
    setDepositOpen(false);
    setWithdrawOpen(false);
    setTransferOpen(false);
  };

  const handleTransaction = (newBalance: number) => {
    dispatch(updateBalance(newBalance))
    dispatch(fetchReportAsync('24h'))
  }

  const transferText = (transaction: Transaction) => {
    if (transaction.transaction_type === 'transfer') {
      if (transaction.destination_account === user?.username) {
        return `Recebido por ${user.username}`
      }
      return `Enviado para ${transaction.destination_account}`
    }
    return ''
  }

  const inOrOut = (transaction: Transaction) => {
    if (transaction.transaction_type === 'transfer') {
      if (transaction.destination_account === user?.username) {
        return 'green'
      }
      return 'red'
    }
    if (transaction.transaction_type === 'deposit') {
      return 'green'
    }

    if (transaction.transaction_type === 'withdraw') {
      return 'red'
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Bem-vindo, {user?.username}
            </Typography>
            <Typography variant="h6">
              Saldo da Conta: ${user?.balance}
            </Typography>
          </Box>
        </Grid>

        {/* Operações (Depósito, Retirada, Transferência) */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Paper>
            <Button onClick={handleOpenDeposit} variant="text" sx={{ width: 200, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              Depósito
              <AccountBalanceWalletIcon />
            </Button>
              <DepositDialog
                open={isDepositOpen}
                onClose={handleClose}
                title="Depósito"
                onConfirm={handleTransaction}
              />
          </Paper>
          <Paper>
            <Button onClick={handleOpenWithdraw} variant="text" sx={{ width: 200, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              Retirada
              <AccountBalanceIcon />
            </Button>
            <WithdrawDialog 
              open={isWithdrawOpen}
              onClose={handleClose}
              title="Saque"
              onConfirm={handleTransaction}
            />
          </Paper>
          <Paper>
            <Button onClick={handleOpenTransfer} variant="text" sx={{ width: 200, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              Transferência
              <PaymentsIcon />
            </Button>
            <TransferDialog 
              open={isTransferOpen}
              onClose={handleClose}
              title="Transferência"
              onConfirm={handleTransaction}
            />
          </Paper>
          
        </Grid>

        {/* Últimas Transações e Total Entrada/Saída nas Últimas 24h */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Últimas Transações
            </Typography>

            { !!report?.transactions?.length ? (<List dense={true}>
              {report?.transactions.slice(report.transactions.length - 5).reverse().map((transaction, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      sx={{ color: inOrOut(transaction) }}
                      primary={`$${transaction.amount} - ${transaction.transaction_type} - ${new Date(transaction.created_at).toLocaleString("pt-Br", {timeZone: "America/Fortaleza"})}`}
                      secondary={transferText(transaction)}
                    />
                  </ListItem>
                  {index < report.transactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>) : (
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}>
                Sem transações rencetes. 
              </Paper>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Últimas 24 horas
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Typography color={"green"} variant="h5">
              +${report?.total_in}
            </Typography>
            <Typography color={"red"} sx={{ background: 'warning'}} variant="h5">
              -${report?.total_out}
            </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;