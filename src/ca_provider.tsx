import {
  CA,
  type ProgressSteps,
  type ProgressStep,
  type Intent as IntentType,
  onAllowanceHookSource,
} from "@arcana/ca-sdk";
import { CAContext, CAErrorContext, CAUnifiedBalanceContext } from "./context";
import React, { useState } from "react";
import { useAccountEffect } from "wagmi";
import Intent from "./components/Intent";
import Modal from "./components/shared/Modal";
import ThemeProvider from "./components/ThemeProvider";
import Progress from "./components/Progression";
import AllowanceSetup from "./components/AllowanceSetup";
import EmptyLoader from "./components/EmptyLoader";
import { clearAsyncInterval, setAsyncInterval } from "./utils/commonFunction";
import UnifiedBalance from "./components/UnifiedBalance";
import GlobalStyles from "./components/GlobalStyles";
import ErrorBox from "./components/Error";
import { getCA } from "./ca";

type currentStep =
  | "ub"
  | "allowance"
  | "intent"
  | "progression"
  | "loading"
  | "none"
  | "error";

const provider = getCA();

export const CAProvider = ({ children }: { children?: React.ReactNode }) => {
  const { ca, ready } = useProvideCA(provider);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<currentStep>("none");

  const [steps, setSteps] = React.useState<
    Array<ProgressStep & { done: boolean }>
  >([]);
  const [intentRefreshing, setIntentRefreshing] = React.useState(false);

  const intentP = React.useRef({
    allow: () => {},
    deny: () => {},
    intent: null as IntentType | null,
    intervalHandler: null as null | number,
  });

  const allowanceP = React.useRef<{
    allow: ((s: Array<"min" | "max" | bigint | string>) => void) | null;
    deny: () => void;
    sources: Array<onAllowanceHookSource & { done: boolean }>;
  }>({
    allow: null,
    deny: () => {},
    sources: [],
  });

  React.useEffect(() => {
    if (error) {
      setCurrentStep("error");
    }
  }, [error]);
  React.useEffect(() => {
    if (ca) {
      ca.setOnIntentHook(async ({ intent, allow, deny, refresh }) => {
        console.log({ intent });
        intentP.current.allow = allow;
        intentP.current.deny = deny;
        intentP.current.intent = intent;
        intentP.current.intervalHandler = setAsyncInterval(async () => {
          console.time("intentRefresh");
          setIntentRefreshing(true);
          intentP.current.intent = await refresh();
          setIntentRefreshing(false);
          console.timeEnd("intentRefresh");
        }, 5000);
        setCurrentStep("intent");
      });

      ca.setOnAllowanceHook(async ({ allow, deny, sources }) => {
        allowanceP.current.sources = sources.map((s) => ({
          ...s,
          done: false,
        }));
        allowanceP.current.allow = allow;
        allowanceP.current.deny = deny;
        setCurrentStep("allowance");
        allowanceP.current.allow(sources.map((s) => "max"));
      });

      ca.caEvents.addListener("expected_steps", (data: ProgressSteps) => {
        setCurrentStep("progression");
        setSteps(data.map((d) => ({ ...d, done: false })));
      });

      ca.caEvents.addListener("step_complete", (data: ProgressStep) => {
        setSteps((steps) => {
          return steps.map((s) => {
            if (s.type === data.type) {
              const ns = { ...s, done: true };
              if (data.data) {
                ns.data = data.data;
              }
              return ns;
            }
            return s;
          });
        });

        if (data.type === "ALLOWANCE_APPROVAL_MINED") {
          const tid = data.typeID.split("_")[1];
          const chainID = parseInt(tid, 10);
          const v = allowanceP.current.sources.find(
            (a) => a.chainID === chainID
          );
          if (v) {
            v.done = true;
          }
        }
      });
    }

    return () => {
      ca.caEvents.removeAllListeners("expected_steps");
      ca.caEvents.removeAllListeners("step_complete");
    };
  }, [ca]);

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
                    <Intent
                      intent={intentP.current.intent!}
                      allow={() => {
                        if (intentP.current.intervalHandler != null) {
                          clearAsyncInterval(intentP.current.intervalHandler);
                          intentP.current.intervalHandler = null;
                        }
                        intentP.current.allow();
                        setCurrentStep("progression");
                      }}
                      deny={() => {
                        console.log({ intentP });

                        if (intentP.current.intervalHandler != null) {
                          console.log("setting intervalHandler");
                          clearAsyncInterval(intentP.current.intervalHandler);
                          intentP.current.intervalHandler = null;
                        }
                        setCurrentStep("none");
                        intentP.current.deny();
                      }}
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
                      close={() => setCurrentStep("loading")}
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

const useProvideCA = (ca: CA) => {
  const [ready, setReady] = useState(false);
  useAccountEffect({
    async onConnect({ connector }) {
      const p = await connector.getProvider();
      ca.setEVMProvider(p as any);
      await ca.init();
      setReady(true);
    },
    onDisconnect() {
      ca.deinit();
      setReady(false);
    },
  });
  return { ca, ready };
};
