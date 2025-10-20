import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useAuth } from '../contexts/AuthContextOTP';
import { getMyAssignment, getEvent } from '../services/eventService';

const AssignmentPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<any | null>(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssignment();
  }, [eventId, user]);

  const loadAssignment = async () => {
    if (!eventId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const [assignmentData, eventData] = await Promise.all([
        getMyAssignment(eventId, user.uid),
        getEvent(eventId),
      ]);

      if (!assignmentData) {
        setError('No assignment found. The draw may not have been performed yet.');
        return;
      }

      setAssignment(assignmentData);
      setEventTitle(eventData?.title || 'Secret Santa');
    } catch (err: any) {
      console.error('Error loading assignment:', err);
      setError(err.message || 'Failed to load assignment');
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/event/${eventId}`)}
          sx={{ mt: 2 }}
        >
          Back to Event
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/event/${eventId}`)}
        sx={{ mb: 3, textTransform: 'none' }}
      >
        Back to Event
      </Button>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #FF6B35 0%, #1E3A5F 100%)',
          color: 'white',
        }}
      >
        <CardGiftcardIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Your Secret Santa Assignment
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {eventTitle}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ mt: 3, p: 4 }}>
        <Typography variant="h6" gutterBottom color="text.secondary" textAlign="center">
          You are the Secret Santa for:
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: '2.5rem',
              bgcolor: 'primary.main',
            }}
          >
            {assignment?.recipientName?.[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h4" fontWeight="bold" color="primary">
            {assignment?.recipientName}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {assignment?.recipientEmail}
          </Typography>
        </Box>

        {assignment?.recipientNote && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Gift Preferences:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">{assignment.recipientNote}</Typography>
              </Paper>
            </Box>
          </>
        )}

        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            🤫 <strong>Remember:</strong> Keep this assignment secret! Don't share it with anyone,
            especially not your recipient.
          </Typography>
        </Alert>
      </Paper>

      <Paper elevation={0} sx={{ mt: 3, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          This information has also been sent to your email. If you have any questions, please
          contact the event organizer.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AssignmentPage;

