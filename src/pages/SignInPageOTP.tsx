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
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../contexts/AuthContextOTP';
import { appConfig } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const SignInPageOTP: React.FC = () => {
  const { sendOTP, user, isValidDomain } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const navigate = useNavigate();

  // Redirect if already signed in with valid domain
  React.useEffect(() => {
    if (user && isValidDomain) {
      navigate('/dashboard');
    }
  }, [user, isValidDomain, navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendOTP(email);
      setOtpSent(true);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send verification email');
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
          {/* Logo */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Logo variant="full" size="large" />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'secondary.main',
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

          {!otpSent ? (
            <>
              {/* Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Enter your company email to receive a sign-in link
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

              {/* Sign In Form */}
              <Box component="form" onSubmit={handleSendOTP}>
                <TextField
                  fullWidth
                  label="Company Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder={`you@${appConfig.allowedDomain}`}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Sign-In Link'}
                </Button>
              </Box>
            </>
          ) : (
            <>
              {/* Success Message */}
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Check Your Email!
                </Typography>
                <Typography variant="body2">
                  We've sent a sign-in link to <strong>{email}</strong>
                </Typography>
              </Alert>

              <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  📧 <strong>Check your inbox</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Click the link in the email to sign in instantly
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The link will expire in 1 hour
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={() => {
                  setOtpSent(false);
                  setEmail('');
                }}
                sx={{ textTransform: 'none' }}
              >
                Use Different Email
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPageOTP;

