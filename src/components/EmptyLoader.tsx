import React from "react";
import styled from "styled-components";
import { useTheme } from "./ThemeProvider";
import DarkLoader from "../assets/videos/Loader_Dark.webm";
import Loader from "../assets/videos/Loader_Light.webm";

const Video = styled.video`
  height: 8rem;
  position: relative;
  animation: fadeIn 0.5s;
  margin: 0 auto;
`;

const EmptyLoader = () => {
  const { isDarkMode } = useTheme();
  return (
    <Video
      src={isDarkMode ? DarkLoader : Loader}
      autoPlay
      loop
      muted
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default EmptyLoader;
