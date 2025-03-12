import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Loader from "./shared/Loader";
import { VIDEO_LINKS, IMAGE_LINKS } from "../utils/assetList";
import { Checkbox, CheckboxControl, CheckboxLabel } from "@ark-ui/react";
import { useTheme } from "./ThemeProvider";
import type { onAllowanceHookSource } from "@arcana/ca-sdk";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Nohami", sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 10px;
  color: ${({ theme }) => theme.primaryColor};
  text-align: center;
`;

const Description = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin: 0 0 10px;
  color: ${({ theme }) => theme.primaryTitleColor};
  text-align: center;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 15px 20px;
  width: 100%;
  background: ${({ theme }) => theme.primaryColor};
  color: ${({ theme }) => theme.buttonTextColor};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.3s ease;
`;

const Video = styled.video`
  height: 8rem;
  position: relative;
  animation: fadeIn 0.5s;
  margin: 0 auto;
`;

const BigLoaderWrap = styled.div`
  width: 5rem;
  margin: 1rem auto;
`;
const LoaderWrap = styled.div`
  width: 2rem;
  animation: fadeIn 0.5s;
`;

const ProcessVideo = styled.video.attrs(() => ({
  muted: true,
  playsInline: true,
}))`
  height: 2rem;
  position: relative;
  animation: fadeIn 0.5s;
`;

const SectionTitle = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  justify-content: start;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${({ isDarkMode, theme }) =>
    isDarkMode ? theme.primaryTitleColor : theme.primaryTitleColor};
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.3s;
  border-radius: 12px;
  margin: 6px 0px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background: ${({ theme }) => theme.cardDetailsBackGround};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  border: ${({ theme }) => `1px solid ${theme.backgroundColor}`};
  max-height: 200px;
  overflow: auto;
`;

const StyledCheckboxLabel = styled(CheckboxLabel)<{ disabled: boolean }>`
  text-align: start;
  font-family: "Nohemi", sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.primaryColor};
  opacity: ${({ disabled }) => (disabled ? "40%" : "100%")};
`;

const StyledCheckboxControl = styled(CheckboxControl)<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  transition: all 0.3s;
`;

// const Step = styled.div<{ isDarkMode: boolean }>`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-family: "Inter", sans-serif;
//   font-weight: 500;
//   font-size: 0.875rem;
//   color: ${({ isDarkMode, theme }) =>
//     isDarkMode ? theme.secondaryTitleColor : theme.primaryTitleColor};
// `;

const SectionWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0px;
  margin-top: 25px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RelativeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Logo = styled.img`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: #ffffff;
`;

const ChainLogo = styled.img`
  position: absolute;
  bottom: -4px;
  right: -4px;
  z-index: 50;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  border: 1px solid #ffffff;
`;

const TokenDetails = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const TokenName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const ChainName = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

interface IntentComponentProps {
  state: "inprogress" | "success" | "error";
  sources: Array<onAllowanceHookSource & { done: boolean }>;
  close: () => void;
}

const AllowanceSetup: React.FC<IntentComponentProps> = ({
  state,
  sources,
  close,
}) => {
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const incompleteStep = sources.findIndex((s) => s.done === false);
  const currentStep =
    incompleteStep === -1 ? sources.length : incompleteStep + 1;
  const inProgressState = incompleteStep === -1 ? "success" : "inprogress";

  useEffect(() => {
    if (inProgressState === "success") {
      window.setTimeout(() => {
        close();
      }, 1000);
    }
  }, [inProgressState, close]);
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const playVideo = () => {
      video
        .play()
        .then(() => {
          console.log("Video is autoplaying.");
        })
        .catch((err) => {
          console.error("Autoplay failed:", err);
        });
    };

    playVideo();

    const handlePause = () => {
      console.log("Video paused. Attempting to restart...");
      playVideo();
    };

    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <>
      {state === "error" ? (
        <>
          <Title>Oops!</Title>
          <Description>Something went wrong during the setup. </Description>
        </>
      ) : state === "success" ? (
        <>
          <Title>Done</Title>
          <Description>Done Great! Your account is ready to use. </Description>
        </>
      ) : (
        <>
          {inProgressState === "success" ? (
            <Video
              src={VIDEO_LINKS["success"]}
              autoPlay
              muted
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <BigLoaderWrap>
              <Loader $width="13px" />
            </BigLoaderWrap>
          )}

          <SectionWrap>
            <SectionTitle isDarkMode={isDarkMode}>
              SETUP ALLOWANCES
            </SectionTitle>
          </SectionWrap>
          <Card>
            {sources.map((src, index: number) => (
              <Container key={index}>
                <Checkbox.Root value={src.chainName} checked={src.done}>
                  <StyledCheckbox>
                    <StyledCheckboxLabel disabled={index >= currentStep}>
                      <FlexContainer>
                        <RelativeContainer>
                          <Logo src={src.token.logo} alt="Token Logo" />
                          <ChainLogo src={src.chainLogo} alt="Chain Logo" />
                        </RelativeContainer>
                        <TokenDetails>
                          <TokenName>{src.token.name}</TokenName>
                          <ChainName>{src.chainName}</ChainName>
                        </TokenDetails>
                      </FlexContainer>
                    </StyledCheckboxLabel>

                    <StyledCheckboxControl checked={src.done || false}>
                      {src.done === false ? (
                        index == currentStep - 1 ? (
                          <LoaderWrap>
                            <Loader $width="4px" />
                          </LoaderWrap>
                        ) : (
                          "-"
                        )
                      ) : src.done === true ? (
                        <img
                          src={IMAGE_LINKS["success"]}
                          alt="Success"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <img
                          src={IMAGE_LINKS["error"]}
                          alt="Error"
                          width={20}
                          height={20}
                        />
                      )}
                    </StyledCheckboxControl>
                  </StyledCheckbox>
                </Checkbox.Root>
              </Container>
            ))}
          </Card>
        </>
      )}
    </>
  );
};

export default AllowanceSetup;
