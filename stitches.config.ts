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

// const globalStyles = globalCss({
//   '*': {
//     margin: 0,
//     padding: 0,
//     boxSizing: 'border-box',
//   },
//   'html, body #__next': {
//     minHeight: '100vh',

//     fontFamily: '$roboto',
//     fontWeight: 400,

//     backgroundColor: '#fff',

//     width: '100%',
//     height: 'fit-content',
//   },
//   a: {
//     color: 'inherit',
//   },
//   '@font-face': [
//     {
//       fontFamily: 'Roboto',
//       fontStyle: "normal",
//       fontWeight: 400,
//       fontDisplay: "swap",
//       src: "url(/assets/fonts/Roboto/Roboto.woff2) format('woff2')",
//     }
//   ]
// });

export { css, styled, theme, getCssText };

export function getGlobalCss() {
  return `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body #__next {
    min-height: 100vh;

    font-family: Roboto;
    font-weight: 400;

    background-color: #fff;

    width: 100%;
    height: fit-content;
  }
  a {
    color: inherit;
  }
  @font-face {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(/assets/fonts/Roboto/Roboto.woff2) format('woff2');
  }
  `.replaceAll("\n", "").replaceAll(" ", "").replaceAll("\t", "")
}
