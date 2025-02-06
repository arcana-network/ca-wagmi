import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Loader from "../assets/videos/Loader_Light.webm";
import DarkLoader from "../assets/videos/Loader_Dark.webm";
import ProcessLoader from "../assets/videos/Circle_Loader.webm";
import ProcessLoaderDark from "../assets/videos/Circle_Loader_Dark.webm";
import Success from "../assets/videos/Success.webm";
import Error from "../assets/videos/Error.webm";
import SuccessCheck from "../assets/images/SuccessCheck.svg";
import ErrorCheck from "../assets/images/ErrorExclamation.svg";
import Link from "../assets/images/Link.svg";
import { getTextFromStep } from "../utils/getTextFromSteps";
import { Checkbox, CheckboxControl, CheckboxLabel } from "@ark-ui/react";
import { useTheme } from "./ThemeProvider";
import type { ProgressStep } from "@arcana/ca-sdk";

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
  margin: 0 auto;
  height: 8rem;
  position: relative;
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

// const SectionTitle = styled.div<{ isDarkMode: boolean }>`
//   display: flex;
//   justify-content: start;
//   font-family: "Inter", sans-serif;
//   font-size: 1rem;
//   font-weight: 700;
//   color: ${({ isDarkMode, theme }) =>
//     isDarkMode ? theme.secondaryTitleColor : theme.primaryTitleColor};
//   margin: 6px 0px;
//   margin-top: 25px;
// `;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.3s;
  border-radius: 12px;
  margin: 6px 0px;
`;

const StyledCheckboxLabel = styled(CheckboxLabel)<{ disabled: boolean }>`
  text-align: start;
  font-family: "Nohemi", sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  color: ${({ theme, disabled }) =>
    disabled ? "#829299" : theme.primaryColor};
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

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
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

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.secondaryColor};
  text-decoration: none;

  &:hover,
  &:active {
    text-decoration: none;
  }
`;

interface IntentComponentProps {
  state: "inprogress" | "success" | "error";
  intentSteps: Array<ProgressStep & { done: boolean }>;
  close: () => void;
}

const stepList = [
  "INTENT_SUBMITTED",
  "INTENT_COLLECTION_COMPLETE",
  "INTENT_FULFILLED",
];

const Progress: React.FC<IntentComponentProps> = ({
  state,
  intentSteps,
  close,
}) => {
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const steps = intentSteps.filter((s) => stepList.includes(s.type));
  const incompleteStep = steps.findIndex((s) => s.done === false);
  const currentStep = incompleteStep === -1 ? steps.length : incompleteStep + 1;
  const inProgressState = incompleteStep === -1 ? "success" : "inprogress";
  const explorerURL =
    // @ts-ignore
    steps.find((s) => {
      return s.type === "INTENT_SUBMITTED" && s.done === true;
      // @ts-ignore
    })?.data.explorerURL ?? "";
  console.log({ explorerURL });
  console.log({
    exp: steps.find((s) => {
      return s.type === "INTENT_SUBMITTED" && s.done === true;
    }),
  });

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
        <Video
          src={Error}
          autoPlay
          muted
          onContextMenu={(e) => e.preventDefault()}
        />
      ) : state === "success" ? (
        <Video
          src={Success}
          autoPlay
          muted
          onContextMenu={(e) => e.preventDefault()}
        />
      ) : (
        ""
      )}

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
              src={Success}
              autoPlay
              muted
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <Video
              src={isDarkMode ? DarkLoader : Loader}
              autoPlay
              loop
              muted
              onContextMenu={(e) => e.preventDefault()}
            />
          )}

          <Container>
            {steps.map((step, index: number) => (
              <>
                <Checkbox.Root
                  value={step.type}
                  checked={step.done || false}
                  disabled={
                    index !== 0 && !step.done && !intentSteps[index - 1]?.done
                  }
                >
                  <StyledCheckbox>
                    <StyledCheckboxLabel
                      disabled={
                        inProgressState != "success" &&
                        !step.done &&
                        index > incompleteStep
                      }
                    >
                      {getTextFromStep(step.type, step.done || false)}
                    </StyledCheckboxLabel>

                    <StyledCheckboxControl checked={step.done || false}>
                      {step.done === false ? (
                        index == currentStep - 1 ? (
                          <ProcessVideo
                            src={isDarkMode ? ProcessLoaderDark : ProcessLoader}
                            ref={videoRef}
                            muted
                            autoPlay
                            playsInline
                            preload="auto"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        ) : (
                          "-"
                        )
                      ) : step.done === true ? (
                        <img
                          src={SuccessCheck}
                          alt="Success"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <img
                          src={ErrorCheck}
                          alt="Error"
                          width={20}
                          height={20}
                        />
                      )}
                    </StyledCheckboxControl>
                  </StyledCheckbox>
                </Checkbox.Root>
              </>
            ))}
            {explorerURL && (
              <LinkContainer>
                <StyledLink href={explorerURL} target="_blank">
                  <img src={Link} alt="Link" width={20} height={20} />
                  <span>View Intent</span>
                </StyledLink>
              </LinkContainer>
            )}
          </Container>
        </>
      )}

      <Button onClick={close}>
        {state === "error"
          ? "Retry"
          : state === "success"
          ? "Continue"
          : "Close"}
      </Button>
    </>
  );
};

export default Progress;
