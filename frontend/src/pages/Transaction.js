import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/transactions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(response.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Player</strong></TableCell>
            <TableCell><strong>Seller Team</strong></TableCell>
            <TableCell><strong>Buyer Team</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.player?.name || 'Unknown'}</TableCell>
              <TableCell>{transaction.sellerTeam?.name || 'Unknown'}</TableCell>
              <TableCell>{transaction.buyerTeam?.name || 'Unknown'}</TableCell>
              <TableCell>${transaction.price.toLocaleString()}</TableCell>
              <TableCell>{new Intl.DateTimeFormat('en-US').format(new Date(transaction.createdAt))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        Transaction History
      </Typography>

      {loading && (
        <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}

      {transactions.length === 0 && !loading && !error && (
        <Typography sx={{ textAlign: 'center' }}>No transactions found.</Typography>
      )}

      {!loading && !error && transactions.length > 0 && renderTable()}
    </Container>
  );
};

export default TransactionsPage;
