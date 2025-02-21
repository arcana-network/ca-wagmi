import React from "react";
import Loader from "./shared/Loader";
import styled from "styled-components";

const LoaderWrap = styled.div`
  width: 5rem;
  margin: 1rem auto;
`;
const EmptyLoader = () => {
  return (
    <LoaderWrap>
      <Loader $width="13px" />
    </LoaderWrap>
  );
};

export default EmptyLoader;
