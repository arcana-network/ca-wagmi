import {
  Config,
  ResolvedRegister,
  UseSendTransactionParameters,
  UseSendTransactionReturnType,
  useSendTransaction as internalUseSendTransaction,
} from "wagmi";
import { useCA } from "./useCA";
import { useContext } from "react";
import { CAErrorContext } from "../context";

function useSendTransaction<
  config extends Config = ResolvedRegister["config"],
  context = unknown
>(
  parameters: UseSendTransactionParameters<config, context> = {}
): UseSendTransactionReturnType<config, context> {
  const r = internalUseSendTransaction(parameters);
  const { ca } = useCA();
  const { setError } = useContext(CAErrorContext);
  const originalSendTx = r.sendTransaction;

  const sendTransaction = (
    variables: Parameters<UseSendTransactionReturnType["sendTransaction"]>[0],
    options?: Parameters<typeof r.sendTransaction>[1]
  ) => {
    if (ca) {
      ca.preprocess({
        to: variables.to ? variables.to : undefined,
        data: variables.data ? variables.data : undefined,
        value: variables.value
          ? `0x${variables.value.toString(16)}`
          : undefined,
      })
        .then(() => {
          return originalSendTx(
            variables as Parameters<typeof r.sendTransaction>[0],
            options
          );
        })
        .catch((e) => {
          setError(e.message);
          if (options?.onError) {
            options.onError(
              e,
              r.variables as Parameters<typeof r.sendTransaction>[0],
              r.context
            );
          }
        });
      return;
    } else {
      return originalSendTx(
        variables as Parameters<typeof r.sendTransaction>[0],
        options
      );
    }
  };
  r.sendTransaction = sendTransaction;
  return r;
}

export { useSendTransaction };
