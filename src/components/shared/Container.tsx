import styled from "styled-components";

const MainContainer = styled.div<{ $display: boolean }>`
  display: ${({ $display }) => ($display ? "block" : "none")};
`;

export { MainContainer as MainContainerBase };
