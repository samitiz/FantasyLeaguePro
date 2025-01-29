import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,

} from '@mui/material';
import { blue, grey, red, green } from '@mui/material/colors';

const TransferMarket = () => {
  const [players, setPlayers] = useState([]); // Market players
  const [teamPlayers, setTeamPlayers] = useState([]); // User's team players
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [userTeamId, setUserTeamId] = useState('');

  useEffect(() => {
    fetchPlayers();
    fetchUserTeam();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/transfer-market/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPlayers(response.data || []);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeam = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/team/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTeamPlayers(response.data.team.players || []); 
      setUserTeamId(response.data.team._id);
    } catch (err) {
      console.error('Error fetching team players:', err);
    }
  };

  const addPlayerToMarket = async () => {
    if (!selectedPlayer || !askingPrice) return;
    try {
      await axios.post(
        'http://localhost:4000/api/transfer-market/add',
        { playerId: selectedPlayer, price: askingPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPlayers();
    } catch (err) {
      console.error('Error adding player to market:', err);
    }
  };

  const removePlayerFromMarket = async (playerId) => {
    try {
      await axios.post(
        'http://localhost:4000/api/transfer-market/remove',
        { playerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPlayers();
    } catch (err) {
      console.error('Error removing player from market:', err);
    }
  };

  const buyPlayer = async (playerId, price, buyerTeamId, sellerTeamId) => {
    try {
      await axios.post(
        'http://localhost:4000/api/transactions/buy',
        { playerId, price, buyerTeamId, sellerTeamId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPlayers();
      fetchUserTeam();
    } catch (err) {
      console.error('Error buying player:', err);
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesName = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = player.team?.name.toLowerCase().includes(filterTeam.toLowerCase());
    const matchesPrice = !filterPrice || player.price <= parseFloat(filterPrice);
    return matchesName && matchesTeam && matchesPrice;
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '2rem', color: blue[700] }}>
        Transfer Market
      </Typography>

      {/* Player Listing Filters */}
      <Box display="flex" justifyContent="space-between" sx={{ marginBottom: '2rem' }}>
        <TextField
          label="Search Players"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, marginRight: '1rem' }}
          InputProps={{
            sx: {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          label="Filter by Team"
          variant="outlined"
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          sx={{ flex: 1, marginRight: '1rem' }}
          InputProps={{
            sx: {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          label="Max Price"
          variant="outlined"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            sx: {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      {/* Add Player to Market */}
      <Box sx={{ marginBottom: '3rem', textAlign: 'center', backgroundColor: grey[50], padding: '2rem', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: blue[700] }}>
          List a Player for Sale
        </Typography>
        <FormControl sx={{ minWidth: 200, marginRight: '1rem' }}>
          <InputLabel>Select Player</InputLabel>
          <Select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            {teamPlayers.length > 0 ? (
              teamPlayers.map((player) => (
                <MenuItem key={player._id} value={player._id}>
                  {player.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No players available</MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          label="Asking Price"
          type="number"
          variant="outlined"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
          sx={{ marginRight: '1rem', borderRadius: '8px' }}
        />
        <Button variant="contained" onClick={addPlayerToMarket} sx={{ borderRadius: '8px', backgroundColor: green[600], '&:hover': { backgroundColor: green[700] } }}>
          Add to Market
        </Button>
      </Box>

      {/* Player Listings */}
      {loading ? (
        <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPlayers.map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player._id}>
              <Card sx={{ boxShadow: 3, borderRadius: '8px', textAlign: 'center', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '1rem', color: blue[700] }}>
                    {player.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: grey[600] }}>
                    Team: {player.team?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                    Price: ${player.price.toLocaleString()}
                  </Typography>
                  {player.availableForSale ? (
                    player.team?._id === userTeamId ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removePlayerFromMarket(player._id)}
                        sx={{
                          marginTop: '1rem',
                          borderRadius: '8px',
                          backgroundColor: red[600],
                          '&:hover': { backgroundColor: red[700] },
                        }}
                      >
                        Remove from Market
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => buyPlayer(player._id, player.price, userTeamId, player.team._id)}
                        sx={{
                          marginTop: '1rem',
                          borderRadius: '8px',
                          backgroundColor: green[600],
                          '&:hover': { backgroundColor: green[700] },
                        }}
                      >
                        Buy Player
                      </Button>
                    )
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TransferMarket;
