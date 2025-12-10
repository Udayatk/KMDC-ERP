// Responsive design constants for consistent breakpoints and spacing across the application
export const BREAKPOINTS = {
  // Standard breakpoints matching Material-UI defaults
  XS: 0,      // Extra small devices (portrait phones)
  SM: 600,    // Small devices (landscape phones)
  MD: 900,    // Medium devices (tablets)
  LG: 1200,   // Large devices (desktops)
  XL: 1536    // Extra large devices (large desktops)
};

// Responsive padding values
export const PADDING = {
  XS: 2,
  SM: 3,
  MD: 4,
  LG: 5,
  XL: 6
};

// Responsive margin values
export const MARGIN = {
  XS: 1.5,
  SM: 2,
  MD: 3,
  LG: 4,
  XL: 5
};

// Responsive font sizes
export const FONT_SIZES = {
  XS: '0.75rem',     // 12px
  SM: '0.875rem',    // 14px
  MD: '1rem',        // 16px
  LG: '1.125rem',    // 18px
  XL: '1.25rem'      // 20px
};

// Responsive icon sizes
export const ICON_SIZES = {
  XS: 20,
  SM: 24,
  MD: 28,
  LG: 32,
  XL: 36
};

// Responsive button sizes
export const BUTTON_SIZES = {
  SMALL: {
    HEIGHT: 36,
    PADDING_X: 2,
    PADDING_Y: 1,
    FONT_SIZE: '0.875rem'
  },
  MEDIUM: {
    HEIGHT: 42,
    PADDING_X: 3,
    PADDING_Y: 1.5,
    FONT_SIZE: '1rem'
  },
  LARGE: {
    HEIGHT: 48,
    PADDING_X: 4,
    PADDING_Y: 2,
    FONT_SIZE: '1.125rem'
  }
};

// Responsive container widths
export const CONTAINER_WIDTHS = {
  XS: '100%',
  SM: '540px',
  MD: '720px',
  LG: '960px',
  XL: '1140px',
  XXL: '1320px'
};

// Responsive grid spacing
export const GRID_SPACING = {
  XS: 1,
  SM: 1.5,
  MD: 2,
  LG: 2.5,
  XL: 3
};

// Media queries for custom CSS
export const MEDIA_QUERIES = {
  UP_SM: '@media (min-width: 600px)',
  UP_MD: '@media (min-width: 900px)',
  UP_LG: '@media (min-width: 1200px)',
  UP_XL: '@media (min-width: 1536px)',
  DOWN_SM: '@media (max-width: 599px)',
  DOWN_MD: '@media (max-width: 899px)',
  DOWN_LG: '@media (max-width: 1199px)',
  DOWN_XL: '@media (max-width: 1535px)'
};