import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Alert,
  Button,
} from '@mui/material';
import { blue, red, green, grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/team', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTeam(response.data.team);
      } catch (err) {
        setError('Failed to fetch team data. Please try again later.');
        console.error('Error fetching team:', err);
      }
    };

    fetchTeam();
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#fafafa',
          padding: '1rem',
        }}
      >
        <Alert severity="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ backgroundColor: blue[600] }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!team) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#fafafa',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '2rem' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: blue[700] }}>
          {team.name}
        </Typography>
        <Typography variant="h6" sx={{ color: grey[700] }}>
          Your Team Budget: <span style={{ color: red[500], fontWeight: 'bold' }}>${team.budget}</span>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {team.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Card
              sx={{
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s',
                borderRadius: '16px',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 12px 24px rgba(0, 0, 0, 0.15)`,
                },
                backgroundImage: `linear-gradient(135deg, ${blue[500]} 0%, ${green[500]} 100%)`,
                color: '#fff',
              }}
            >
              <CardContent sx={{ padding: '1.5rem' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    marginBottom: '1rem',
                    backgroundColor: '#fff',
                    border: '3px solid',
                    borderColor: '#1976d2',
                    boxShadow: `0 4px 10px rgba(0, 0, 0, 0.2)`,
                  }}
                  src={player.avatarUrl || '/default-avatar.png'}
                  alt={player.name}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {player.name}
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                  {player.position}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                  Price: ${player.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
