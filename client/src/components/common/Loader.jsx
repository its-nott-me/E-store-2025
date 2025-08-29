// const Loader = ({ size = 'medium', fullScreen = false }) => {
//   const sizeClasses = {
//     small: 'h-4 w-4',
//     medium: 'h-8 w-8',
//     large: 'h-12 w-12',
//   }

//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
//         <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`} />
//       </div>
//     )
//   }

//   return (
//     <div className="flex items-center justify-center p-4">
//       <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`} />
//     </div>
//   )
// }

// export default Loader

import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  // Determine size class based on the 'size' prop
  const sizeClass = sizeClasses[size];

  return (
    <StyledWrapper fullScreen={fullScreen}>
      <div className={`three-body ${sizeClass}`}>
        <div className="three-body__dot" />
        <div className="three-body__dot" />
        <div className="three-body__dot" />
      </div>
    </StyledWrapper>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const wobble1 = keyframes`
  0%, 100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(-66%) scale(0.65);
    opacity: 0.8;
  }
`;

const wobble2 = keyframes`
  0%, 100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(66%) scale(0.65);
    opacity: 0.8;
  }
`;

const StyledWrapper = styled.div`
  ${(props) =>
    props.fullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  `}
  
  display: flex;
  justify-content: center;
  align-items: center;

  .three-body {
    --uib-size: 35px;
    --uib-speed: 0.8s;
    --uib-color: #5D3FD3;
    position: relative;
    display: inline-block;
    height: var(--uib-size);
    width: var(--uib-size);
    animation: ${spin} calc(var(--uib-speed) * 2.5) infinite linear;
  }

  .three-body__dot {
    position: absolute;
    height: 100%;
    width: 30%;
  }

  .three-body__dot::after {
    content: '';
    position: absolute;
    height: 0%;
    width: 100%;
    padding-bottom: 100%;
    background-color: var(--uib-color);
    border-radius: 50%;
  }

  .three-body__dot:nth-child(1) {
    bottom: 5%;
    left: 0;
    transform: rotate(60deg);
    transform-origin: 50% 85%;
  }

  .three-body__dot:nth-child(1)::after {
    bottom: 0;
    left: 0;
    animation: ${wobble1} var(--uib-speed) infinite ease-in-out;
    animation-delay: calc(var(--uib-speed) * -0.3);
  }

  .three-body__dot:nth-child(2) {
    bottom: 5%;
    right: 0;
    transform: rotate(-60deg);
    transform-origin: 50% 85%;
  }

  .three-body__dot:nth-child(2)::after {
    bottom: 0;
    left: 0;
    animation: ${wobble1} var(--uib-speed) infinite calc(var(--uib-speed) * -0.15) ease-in-out;
  }

  .three-body__dot:nth-child(3) {
    bottom: -5%;
    left: 0;
    transform: translateX(116.666%);
  }

  .three-body__dot:nth-child(3)::after {
    top: 0;
    left: 0;
    animation: ${wobble2} var(--uib-speed) infinite ease-in-out;
  }
`;

export default Loader;
