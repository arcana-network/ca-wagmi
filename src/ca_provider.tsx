import { CAContext, CAErrorContext, CAUnifiedBalanceContext } from "./context";
import React from "react";
import IntentView from "./components/IntentView";
import Modal from "./components/shared/Modal";
import ThemeProvider from "./components/ThemeProvider";
import Progress from "./components/Progression";
import AllowanceSetup from "./components/AllowanceSetup";
import EmptyLoader from "./components/EmptyLoader";
import UnifiedBalance from "./components/UnifiedBalance";
import GlobalStyles from "./components/GlobalStyles";
import ErrorBox from "./components/Error";
import { getCA } from "./ca";
import { useCAInternal, useProvideCA } from "./hooks/useCAInternal";

const provider = getCA();

export const CAProvider = ({ children }: { children?: React.ReactNode }) => {
  const { ca, ready } = useProvideCA(provider);
  const {
    steps,
    setCurrentStep,
    currentStep,
    intentP,
    allowanceP,
    intentRefreshing,
    intentDeny,
    intentAllow,
    error,
    setError,
  } = useCAInternal(ca);

  return (
    <>
      <GlobalStyles />
      <CAContext.Provider value={{ ca, ready }}>
        <ThemeProvider>
          <CAErrorContext.Provider value={{ error, setError }}>
            <CAUnifiedBalanceContext.Provider
              value={{
                visible: currentStep === "ub",
                setVisible: (v) => setCurrentStep(v ? "ub" : "none"),
              }}
            >
              <>
                <Modal isopen={currentStep !== "none"}>
                  {currentStep === "intent" && (
                    <IntentView
                      intent={intentP.current.intent}
                      allow={intentAllow}
                      deny={intentDeny}
                      intentRefreshing={intentRefreshing}
                    />
                  )}
                  {currentStep === "progression" && (
                    <Progress
                      state="inprogress"
                      intentSteps={steps}
                      close={() => {
                        setCurrentStep("none");
                      }}
                    />
                  )}
                  {currentStep === "allowance" && (
                    <AllowanceSetup
                      sources={allowanceP.current.sources}
                      state="inprogress"
                      close={() =>
                        setCurrentStep((step) =>
                          step !== "intent" ? "loading" : step
                        )
                      }
                    />
                  )}
                  <UnifiedBalance
                    $display={currentStep === "ub"}
                    close={() => setCurrentStep("none")}
                  />

                  {currentStep === "loading" && <EmptyLoader />}
                  {currentStep === "error" && (
                    <ErrorBox
                      message={error}
                      close={() => {
                        setError("");
                        setCurrentStep("none");
                      }}
                    />
                  )}
                </Modal>
              </>
              <>{children}</>
            </CAUnifiedBalanceContext.Provider>
          </CAErrorContext.Provider>
        </ThemeProvider>
      </CAContext.Provider>
    </>
  );
};
