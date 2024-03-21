import { Container, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchReportAsync, selectReport, selectReportStatus } from '../store/reportSlice';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks';
import { RootState } from '../store/store';
import { Transaction } from '../types';

const Transactions = () => {
  const dispatch = useAppDispatch()
  const report = useSelector(selectReport)
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reportStatus = useSelector(selectReportStatus)
  const navigate = useNavigate()

  const [timeFrame, setTimeFrame] = useState('24h');

  const handleTimeFrameChange = (event: any) => {
    setTimeFrame(event.target.value as string);
  };

  useEffect(() => {
    
      dispatch(fetchReportAsync(timeFrame || '24h'));
    
  }, [isAuthenticated, timeFrame, navigate, dispatch])

  if (reportStatus !== 'succeeded') {
    return <div></div>;
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
    <Container maxWidth="lg">
    <Typography variant="h4" sx={{ mb: 4 }}>Relatório de Transações</Typography>
    <FormControl sx={{my: 1}}>
        <InputLabel id="time-frame-select-label">Período</InputLabel>
        <Select
          labelId="time-frame-select-label"
          id="time-frame-select"
          value={timeFrame}
          label="Período"
          onChange={handleTimeFrameChange}
        >
          <MenuItem value="24h">Últimas 24 horas</MenuItem>
          <MenuItem value="last_week">Últimos 7 dias</MenuItem>
          <MenuItem value="last_month">Últimos 30 dias</MenuItem>
        </Select>
      </FormControl>
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report?.transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell sx={{ color: inOrOut(transaction) }}>{transaction.transaction_type}</TableCell>
              <TableCell sx={{ color: inOrOut(transaction) }} align="right">${transaction.amount}</TableCell>
              <TableCell sx={{ color: inOrOut(transaction) }} align="right">{new Date(transaction.created_at).toLocaleString("pt-Br", {timeZone: "America/Fortaleza"})}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
  );
}

export default Transactions