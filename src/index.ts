import { CAProvider } from "./ca_provider";
import { useSendTransaction } from "./hooks/useSendTransaction";
import {
  useBalance,
  useBalances,
  useBalanceModal,
  useUnifiedBalance,
} from "./hooks/useUnifiedBalance";
import { useWriteContract } from "./hooks/useWriteContract";
import { useCAFn } from "./hooks/useCA";
import { CAUnifiedBalanceContext } from "./context";
import type { UseBalanceReturnValue } from "./hooks/useUnifiedBalance";
import { Network, CA } from "@arcana/ca-sdk";

const getSupportedChains = CA.getSupportedChains;

export {
  Network,
  useSendTransaction,
  useWriteContract,
  useBalance,
  useBalances,
  useBalanceModal,
  useCAFn,
  useUnifiedBalance,
  CAProvider,
  CAUnifiedBalanceContext,
  getSupportedChains,
};

export type { UseBalanceReturnValue as UseBalanceValue };
