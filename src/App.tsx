import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContextOTP';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SignInPage from './pages/SignInPageOTP';
import DashboardPage from './pages/DashboardPage';
import EventPage from './pages/EventPage';
import JoinEventPage from './pages/JoinEventPage';
import AssignmentPage from './pages/AssignmentPage';

// Create theme with INEight branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35', // InEight Orange
      light: '#FF8C5F',
      dark: '#E64A1A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1E3A5F', // InEight Navy Blue
      light: '#2D5280',
      dark: '#0F1D30',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<SignInPage />} />
            <Route path="/join/:eventId" element={<JoinEventPage />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="/event/:eventId/assignment" element={<AssignmentPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

