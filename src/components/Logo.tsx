import React from 'react';
import { Box, Typography } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

interface LogoProps {
  variant?: 'full' | 'icon' | 'white';
  size?: 'small' | 'medium' | 'large';
  showFallback?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'medium',
  showFallback = true 
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeMap = {
    small: { height: 32, iconSize: 32 },
    medium: { height: 48, iconSize: 48 },
    large: { height: 80, iconSize: 80 },
  };

  const dimensions = sizeMap[size];

  // Try to load logo image
  const logoPath = variant === 'white' 
    ? '/logos/ineight-logo-white.png'
    : variant === 'icon'
    ? '/logos/ineight-icon.png'
    : '/logos/ineight-logo.png';

  // Fallback SVG versions
  const logoPathSvg = variant === 'white' 
    ? '/logos/ineight-logo-white.svg'
    : variant === 'icon'
    ? '/logos/ineight-icon.svg'
    : '/logos/ineight-logo.svg';

  if (imageError || !showFallback) {
    // Fallback: Show company name with icon
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CardGiftcardIcon 
          sx={{ 
            fontSize: dimensions.iconSize,
            color: variant === 'white' ? 'white' : 'primary.main',
          }} 
        />
        {variant !== 'icon' && (
          <Typography
            variant={size === 'large' ? 'h4' : size === 'medium' ? 'h5' : 'h6'}
            sx={{
              fontWeight: 700,
              color: variant === 'white' ? 'white' : 'primary.main',
            }}
          >
            InEight
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <picture>
        <source srcSet={logoPathSvg} type="image/svg+xml" />
        <img
          src={logoPath}
          alt="InEight Logo"
          style={{
            height: dimensions.height,
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
          onError={() => setImageError(true)}
        />
      </picture>
    </Box>
  );
};

export default Logo;

