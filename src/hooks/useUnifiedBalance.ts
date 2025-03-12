import { useContext } from "react";
import { CAUnifiedBalanceContext, CAContext } from "../context";
import Decimal from "decimal.js";
import { useQuery } from "@tanstack/react-query";
import { ALLOWED_TOKENS } from "../utils/constants";

const UNIFIED_BALANCE_KEY = "xar_unified_balance";
const BALANCE_REFETCH_INTERVAL = 30_000;

const useUnifiedBalance = () => {
  const { ca, ready } = useContext(CAContext);

  const { isPending, data } = useQuery({
    queryKey: [UNIFIED_BALANCE_KEY],
    queryFn: () => {
      if (ca && ready) {
        return ca.getUnifiedBalances();
      }
      return [];
    },
    refetchInterval: BALANCE_REFETCH_INTERVAL,
    enabled: ready && ca !== null,
  });
  let balance = 0n;
  const ethBalance = data?.find((b) => b.symbol.toLowerCase() === "eth");
  if (ethBalance) {
    balance = BigInt(
      new Decimal(ethBalance.balance).mul(Decimal.pow(10, 18)).toString()
    );
  }

  const getAssetBalance = (asset: string) => {
    if (data?.length) {
      return data.find((b) => b.symbol.toLowerCase() === asset.toLowerCase());
    }
    return null;
  };
  return {
    balances: data ?? [],
    balance,
    loading: isPending,
    getAssetBalance,
  };
};

const useBalanceModal = () => {
  const { setVisible } = useContext(CAUnifiedBalanceContext);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return {
    showModal,
    hideModal,
  };
};

type UseBalanceParams = {
  symbol: ALLOWED_TOKENS;
};

type UseBalanceReturn = {
  loading: boolean;
  value: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  } | null;
  error: Error | null;
};

const useBalance = ({ symbol }: UseBalanceParams): UseBalanceReturn => {
  const { ca, ready } = useContext(CAContext);

  const { isPending, data, isSuccess, error } = useQuery({
    queryKey: [UNIFIED_BALANCE_KEY],
    queryFn: () => {
      if (ca && ready) {
        return ca.getUnifiedBalances();
      }
      return [];
    },
    refetchInterval: BALANCE_REFETCH_INTERVAL,
    enabled: ready && ca !== null,
  });

  if (isSuccess) {
    const val = data.find(
      (b) => b.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (!val) {
      return {
        loading: false,
        value: null,
        error: new Error("asset not supported"),
      };
    }
    return {
      loading: false,
      value: {
        decimals: val.decimals,
        formatted: val.balance,
        symbol: val.symbol.toUpperCase(),
        value: BigInt(
          new Decimal(val.balance).mul(Decimal.pow(10, val.decimals)).toString()
        ),
      },
      error: null,
    };
  } else {
    return {
      loading: isPending,
      error: error,
      value: null,
    };
  }
};
export { useUnifiedBalance, useBalanceModal, useBalance };
