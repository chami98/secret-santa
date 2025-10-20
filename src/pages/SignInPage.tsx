import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useAuth } from '../contexts/AuthContext';
import { appConfig } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const { signInWithMicrosoft, user, isValidDomain } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if already signed in with valid domain
  React.useEffect(() => {
    if (user && isValidDomain) {
      navigate('/dashboard');
    }
  }, [user, isValidDomain, navigate]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithMicrosoft();
      // Navigation will happen via useEffect
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(
        err.message || 'Failed to sign in. Please check your email domain and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          {/* Logo/Icon */}
          <Box sx={{ mb: 3 }}>
            <CardGiftcardIcon
              sx={{
                fontSize: 80,
                color: 'primary.main',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            Secret Santa
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            {appConfig.companyName} Gift Exchange
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in with your company Microsoft account to create or join a Secret Santa event.
          </Typography>

          {/* Domain info */}
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Note:</strong> Only {appConfig.companyName} employees with{' '}
              <strong>@{appConfig.allowedDomain}</strong> email addresses can participate.
            </Typography>
          </Alert>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Sign in with invalid domain warning */}
          {user && !isValidDomain && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Your email domain is not authorized. Please sign in with a{' '}
              <strong>@{appConfig.allowedDomain}</strong> account.
            </Alert>
          )}

          {/* Sign in button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MicrosoftIcon />}
            onClick={handleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Microsoft'}
          </Button>

          {/* Features list */}
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
              <li>Create and manage Secret Santa events</li>
              <li>Invite colleagues with shareable links</li>
              <li>Automatic random assignment</li>
              <li>Email notifications</li>
              <li>Mobile-friendly interface</li>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPage;

