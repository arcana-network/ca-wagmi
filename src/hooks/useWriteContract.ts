import {
  Config,
  ResolvedRegister,
  useWriteContract as internalUseWriteContract,
  UseWriteContractParameters,
  UseWriteContractReturnType,
} from "wagmi";
import { encodeFunctionData } from "viem";
import { useCA } from "./useCA";
import { useContext } from "react";
import { CAErrorContext } from "../context";

function useWriteContract<
  config extends Config = ResolvedRegister["config"],
  context = unknown
>(
  parameters: UseWriteContractParameters<config, context> = {}
): UseWriteContractReturnType<config, context> {
  const wcr = internalUseWriteContract(parameters);
  const originalWC = wcr.writeContract;
  const { ca, ready } = useCA();
  const { setError } = useContext(CAErrorContext);

  const writeContract: typeof originalWC = (variables, options?) => {
    if (ca && ready) {
      const data = encodeFunctionData(
        variables as Parameters<typeof originalWC>[0]
      );

      ca.preprocess({
        to: variables.address,
        data: data,
        value:
          typeof variables.value === "bigint"
            ? `0x${variables.value.toString(16)}`
            : undefined,
      })
        .then(() => {
          return originalWC(variables, options);
        })
        .catch((e) => {
          setError(e.message);
          if (options?.onError) {
            options.onError(
              e,
              variables as Parameters<typeof options.onError>[1],
              wcr.context
            );
          }
        });
      return;
    } else {
      return originalWC(variables, options);
    }
  };

  wcr.writeContract = writeContract;
  return wcr;
}

export { useWriteContract };
