import { createStitches, globalCss } from '@stitches/react';

const { css, styled, theme, getCssText } = createStitches({
  theme: {
    fonts: {
      system: 'system-ui',
      roboto: 'Roboto',
    },
    fontSizes: {
      h1: '10rem',
      h2: '6rem',
    }
  },
  media: {
    ['mobile-small']: '(max-width: 300px)',
    mobile: '(max-width: 480px)',
    tablet: '(max-width: 768px)',
    laptop: '(max-width: 1024px)',
    desktop: '(max-width: 1200px)',
    tv: '(min-width: 1201px)',
  },
});

const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html, body #__next': {
    minHeight: '100vh',

    fontFamily: '$roboto',
    fontWeight: 400,

    backgroundColor: '#fff',

    width: '100%',
    height: 'fit-content',

    '@media (max-width: 1024px)': {
      fontSize: '58%',
    },

    '@media (max-width: 768px)': {
      fontSize: '54%',
    },

    '@media (max-width: 480px)': {
      fontSize: '48%',
    },

    '@media (max-width: 300px)': {
      fontSize: '42%',
    },
  },
  a: {
    color: 'inherit',
  },
  '@font-face': [
    {
      fontFamily: 'Roboto',
      fontStyle: "normal",
      fontWeight: 400,
      src: "url(/assets/fonts/Roboto/Roboto.woff2) format('woff2')",
    }
  ]
});

export { css, styled, globalStyles, theme, getCssText };
