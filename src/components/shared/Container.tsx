import React from "react";
import styled from "styled-components";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.primaryColor};
  transition: all 0.3s ease;
`;

const c = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

export default c;
