import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import Arcana from "../../assets/images/ArcanaFooter.svg";
import { useCA } from "../../hooks/useCA";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
`;

const ModalOverlay = styled.div<{ $isopen: boolean }>`
  display: ${({ $isopen }) => ($isopen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.backgroundOverlyColor};
  animation: ${({ $isopen }) => ($isopen ? fadeIn : fadeOut)} 0.3s ease-out;
  z-index: 1000;
`;

const ModalContainer = styled.div<{ $isopen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.modalBackground};
  border: ${({ theme }) => `1px solid ${theme.backgroundColor}`};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
  z-index: 1050;
  animation: ${({ $isopen }) => ($isopen ? slideIn : slideOut)} 0.3s ease-out;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  font-family: "Inter", sans-serif;
  margin-top: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Img = styled.img`
  filter: ${({ theme }) => theme.footerImg};
`;

interface ModalProps {
  isopen: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isopen, children }) => {
  return (
    <ModalOverlay $isopen={isopen}>
      <ModalContainer $isopen={isopen}>
        {children}

        <Footer>
          Powered by
          <Img src={Arcana} alt="Description Image" />
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
