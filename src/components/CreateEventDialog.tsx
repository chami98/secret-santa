import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContextOTP';
import { createEvent } from '../services/eventService';
import { appConfig } from '../config/firebase';
import { EventSettings } from '../types';

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onClose,
  onEventCreated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [minParticipants, setMinParticipants] = useState(3);
  const [giftBudget, setGiftBudget] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.email) {
      setError('You must be signed in to create an event');
      return;
    }

    if (!title.trim()) {
      setError('Please enter an event title');
      return;
    }

    if (minParticipants < 2) {
      setError('Minimum participants must be at least 2');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const settings: EventSettings = {
        allowAnonymous: false,
        minParticipants,
        giftBudget: giftBudget || undefined,
        deliveryDate: deliveryDate || undefined,
      };

      await createEvent(
        title.trim(),
        user.uid,
        user.email,
        appConfig.allowedDomain,
        settings
      );

      // Reset form
      setTitle('');
      setMinParticipants(3);
      setGiftBudget('');
      setDeliveryDate('');

      onEventCreated();
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Secret Santa Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              fullWidth
              label="Event Title"
              placeholder="e.g., Holiday Secret Santa 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Minimum Participants"
              type="number"
              value={minParticipants}
              onChange={(e) => setMinParticipants(parseInt(e.target.value) || 3)}
              inputProps={{ min: 2 }}
              required
              disabled={loading}
              helperText="Draw cannot be performed until this many people have joined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Gift Budget (Optional)"
              placeholder="e.g., $25"
              value={giftBudget}
              onChange={(e) => setGiftBudget(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Delivery Date (Optional)"
              placeholder="e.g., December 25, 2024"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              disabled={loading}
              helperText="When should gifts be exchanged?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateEventDialog;

