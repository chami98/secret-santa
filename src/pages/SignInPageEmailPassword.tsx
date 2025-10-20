import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useAuth } from '../contexts/AuthContextEmailPassword';
import { appConfig } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const SignInPageEmailPassword: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, user, isValidDomain, emailVerified } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Sign Up
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const navigate = useNavigate();

  // Redirect if already signed in with valid domain
  React.useEffect(() => {
    if (user && isValidDomain && emailVerified) {
      navigate('/dashboard');
    }
  }, [user, isValidDomain, emailVerified, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail(email, password, displayName);
      setError(null);
      // Show success message
      alert('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
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

          {/* Email not verified warning */}
          {user && !emailVerified && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Please verify your email before accessing the app. Check your inbox for the verification link.
            </Alert>
          )}

          {/* Tabs */}
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Sign In Form */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleSignIn}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@ineight.com"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
          )}

          {/* Sign Up Form */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleSignUp}>
              <TextField
                fullWidth
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                placeholder="John Doe"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@ineight.com"
                helperText={`Must be a @${appConfig.allowedDomain} email`}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                helperText="Minimum 6 characters"
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            </Box>
          )}

          {/* Features list */}
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
              <li>Company email validation (@{appConfig.allowedDomain})</li>
              <li>Email verification required</li>
              <li>Create and join Secret Santa events</li>
              <li>Automatic random assignment</li>
              <li>Email notifications</li>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPageEmailPassword;

