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
  Chip,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../contexts/AuthContextOTP';
import {
  getEvent,
  getEventParticipants,
  joinEvent,
  getParticipant,
  updateParticipantNote,
} from '../services/eventService';
import { performDraw } from '../services/functionService';
import { Event, Participant } from '../types';

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawDialogOpen, setDrawDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    loadEventData();
  }, [eventId, user]);

  const loadEventData = async () => {
    if (!eventId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const [eventData, participantsData, participantData] = await Promise.all([
        getEvent(eventId),
        getEventParticipants(eventId),
        getParticipant(eventId, user.uid),
      ]);

      if (!eventData) {
        setError('Event not found');
        return;
      }

      setEvent(eventData);
      setParticipants(participantsData);
      setIsParticipant(!!participantData);

      if (participantData?.note) {
        setNote(participantData.note);
      }
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!user || !eventId) return;

    try {
      await joinEvent(eventId, {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        optOut: false,
      });

      setSnackbar({ open: true, message: 'Successfully joined event!' });
      loadEventData();
    } catch (err: any) {
      console.error('Error joining event:', err);
      setError(err.message || 'Failed to join event');
    }
  };

  const handlePerformDraw = async () => {
    if (!eventId) return;

    try {
      setDrawDialogOpen(false);
      setLoading(true);

      const result = await performDraw(eventId);

      if (result.success) {
        setSnackbar({
          open: true,
          message: `Draw complete! ${result.assignmentCount} emails sent.`,
        });
        loadEventData();
      } else {
        setError(result.message || 'Failed to perform draw');
      }
    } catch (err: any) {
      console.error('Error performing draw:', err);
      setError(err.message || 'Failed to perform draw');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJoinLink = () => {
    const joinLink = `${window.location.origin}/join/${eventId}`;
    navigator.clipboard.writeText(joinLink);
    setSnackbar({ open: true, message: 'Join link copied to clipboard!' });
  };

  const handleSaveNote = async () => {
    if (!eventId || !user) return;

    try {
      await updateParticipantNote(eventId, user.uid, note);
      setNoteDialogOpen(false);
      setSnackbar({ open: true, message: 'Note saved!' });
    } catch (err: any) {
      console.error('Error saving note:', err);
      setError(err.message || 'Failed to save note');
    }
  };

  const isOrganizer = event?.organizerUid === user?.uid;
  const activeParticipants = participants.filter(p => !p.optOut);
  const canPerformDraw =
    isOrganizer &&
    event?.status === 'open' &&
    activeParticipants.length >= (event?.settings.minParticipants || 3);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Event not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={event.status.toUpperCase()}
            color={event.status === 'drawn' ? 'primary' : 'success'}
            size="small"
          />
          {isOrganizer && <Chip label="Organizer" color="secondary" size="small" />}
        </Box>
      </Box>

      {/* Event Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Event Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Organizer:</strong> {event.organizerEmail}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Created:</strong> {event.createdAt.toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Min Participants:</strong> {event.settings.minParticipants}
        </Typography>
        {event.settings.giftBudget && (
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Gift Budget:</strong> {event.settings.giftBudget}
          </Typography>
        )}
        {event.settings.deliveryDate && (
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Delivery Date:</strong> {event.settings.deliveryDate}
          </Typography>
        )}

        {/* Join Link */}
        {isOrganizer && event.status === 'open' && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Share this link to invite participants:</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                fullWidth
                value={`${window.location.origin}/join/${eventId}`}
                InputProps={{ readOnly: true }}
              />
              <Tooltip title="Copy link">
                <IconButton onClick={handleCopyJoinLink} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Participants */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Participants ({activeParticipants.length})
          </Typography>
          {!isParticipant && event.status === 'open' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={handleJoinEvent}
              sx={{ textTransform: 'none' }}
            >
              Join Event
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />

        {participants.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No participants yet
          </Typography>
        ) : (
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.uid}>
                <ListItemAvatar>
                  <Avatar src={participant.photoURL} alt={participant.displayName}>
                    {participant.displayName[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={participant.displayName}
                  secondary={participant.email}
                />
                {participant.optOut && (
                  <Chip label="Opted Out" size="small" color="default" />
                )}
              </ListItem>
            ))}
          </List>
        )}

        {isParticipant && event.status === 'open' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setNoteDialogOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              {note ? 'Edit My Gift Preferences' : 'Add Gift Preferences'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Actions */}
      {isOrganizer && event.status === 'open' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Organizer Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {!canPerformDraw && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Need at least {event.settings.minParticipants} participants to perform draw. Currently
              have {activeParticipants.length}.
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ShuffleIcon />}
            onClick={() => setDrawDialogOpen(true)}
            disabled={!canPerformDraw}
            sx={{ textTransform: 'none' }}
          >
            Perform Secret Santa Draw
          </Button>
        </Paper>
      )}

      {/* View Assignment */}
      {event.status === 'drawn' && isParticipant && (
        <Paper sx={{ p: 3, bgcolor: 'success.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6">Draw Complete!</Typography>
          </Box>
          <Typography variant="body2" gutterBottom>
            The Secret Santa draw has been completed. Check your email or click below to view your
            assignment.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/event/${eventId}/assignment`)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            View My Assignment
          </Button>
        </Paper>
      )}

      {/* Draw Confirmation Dialog */}
      <Dialog open={drawDialogOpen} onClose={() => setDrawDialogOpen(false)}>
        <DialogTitle>Confirm Secret Santa Draw</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to perform the Secret Santa draw?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This will:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
            <li>Randomly assign each participant a Secret Santa recipient</li>
            <li>Send an email to each participant with their assignment</li>
            <li>Close the event to new participants</li>
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>{activeParticipants.length}</strong> participants will receive assignments.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrawDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePerformDraw} variant="contained" color="primary">
            Confirm Draw
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gift Preferences</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share any preferences, allergies, or ideas to help your Secret Santa choose the perfect
            gift!
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., I love coffee, books, and plants. No food allergies."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default EventPage;

