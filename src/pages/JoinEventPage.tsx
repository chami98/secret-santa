import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContextOTP';
import { getEvent } from '../services/eventService';
import { Event } from '../types';
import Logo from '../components/Logo';

const JoinEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, isValidDomain } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    // If user is authenticated and has valid domain, redirect to event page
    if (user && isValidDomain && eventId) {
      navigate(`/event/${eventId}`);
    }
  }, [user, isValidDomain, eventId, navigate]);

  const loadEvent = async () => {
    if (!eventId) {
      setError('Invalid event link');
      setLoading(false);
      return;
    }

    try {
      const eventData = await getEvent(eventId);
      if (!eventData) {
        setError('Event not found');
      } else if (eventData.status !== 'open') {
        setError('This event is no longer accepting participants');
      } else {
        setEvent(eventData);
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FF6B35 0%, #1E3A5F 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Logo variant="full" size="large" />
          </Box>

          {error ? (
            <>
              <Typography variant="h5" gutterBottom color="error">
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ mt: 3 }}
              >
                Go to Home
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Join Secret Santa
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                {event?.title}
              </Typography>

              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  You've been invited to join this Secret Santa event!
                </Typography>
              </Alert>

              {!user ? (
                <>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Sign in with your company email to join.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign In to Join
                  </Button>
                </>
              ) : !isValidDomain ? (
                <Alert severity="warning">
                  Your email domain is not authorized for this event.
                </Alert>
              ) : null}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default JoinEventPage;

