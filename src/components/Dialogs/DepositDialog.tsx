import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, CircularProgress, Backdrop } from '@mui/material';
import { makeDeposit } from '../../services/apiService';

interface FinanceFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (amount: number) => void;
}

const DepositDialog: React.FC<FinanceFormDialogProps> = ({ open, onClose, title, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      setLoading(true);
      try {
        const response = await makeDeposit(numAmount);
        const newBalance = parseFloat(response.transaction.source_account.balance)
        onConfirm(newBalance)
        onClose();
      } catch (error) {
        console.error('Erro ao fazer depósito:', error);
      }
      setLoading(false);
      onClose()
    }
  };

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="amount"
          label="Valor"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Confirmar</Button>
      </DialogActions>
    </Dialog>
    <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
    </>
  );
};

export default DepositDialog;
