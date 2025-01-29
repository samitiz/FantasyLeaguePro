import React from 'react';
import { Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container sx={{ textAlign: 'center', marginTop: '5rem' }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1" sx={{ marginTop: '1rem' }}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
    </Container>
  );
};

export default NotFound;
