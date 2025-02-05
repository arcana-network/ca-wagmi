import { createGlobalStyle } from "styled-components";
import NohemiBold from "../assets/fonts/nohemi/Nohemi-Bold.woff2";
import NohemiSemiBold from "../assets/fonts/nohemi/Nohemi-SemiBold.woff2";
import NohemiMedium from "../assets/fonts/nohemi/Nohemi-Medium.woff2";
import NohemiRegular from "../assets/fonts/nohemi/Nohemi-Regular.woff2";

const GlobalStyles = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Sora:wght@100..800&family=Varela+Round&display=swap');

@font-face {
  font-family: Nohemi;
  font-style: normal;
  font-weight: 700;
  src: url(${NohemiBold});
}

@font-face {
  font-family: Nohemi;
  font-style: normal;
  font-weight: 600;
  src: url(${NohemiSemiBold});
}

@font-face {
  font-family: Nohemi;
  font-style: normal;
  font-weight: 500;
  src: url(${NohemiMedium});
}

@font-face {
  font-family: Nohemi;
  font-style: normal;
  font-weight: 400;
  src: url(${NohemiRegular});
}


body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    min-width: 320px;
    min-height: 100vh;
    font-size: 16px;
}

@keyframes accordionSlideDown {
  from {
    opacity: 0;
    height: 0;
  }
  to {
    opacity: 1;
    height: var(--height);
  }
}

@keyframes accordionSlideUp {
  from {
    opacity: 1;
    height: var(--height);
  }
  to {
    opacity: 0;
    height: 0;
  }
}

[data-part='item-content'][data-state='open'] {
  animation: accordionSlideDown 300ms ease-in-out;
}

[data-part='item-content'][data-state='closed'] {
  animation: accordionSlideUp 300ms ease-in-out;
  overflow: hidden;
}

[data-scope='combobox'][data-part='trigger'],
[data-scope='select'][data-part='indicator'],
[data-scope='accordion'][data-part='item-indicator'],
[data-scope='menu'][data-part='indicator'] {
  transition: all 300ms ease;
}

[data-scope='combobox'][data-part='trigger'][data-state='open'],
[data-scope='select'][data-part='indicator'][data-state='open'],
[data-scope='accordion'][data-part='item-indicator'][data-state='open'],
[data-scope='menu'][data-part='indicator'][data-state='open'] {
  transform: rotate(-180deg);
}

`;

export default GlobalStyles;
