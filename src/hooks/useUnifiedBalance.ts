import { UserAsset } from "@arcana/ca-sdk";
import { useState, useContext, useEffect } from "react";
import { clearAsyncInterval, setAsyncInterval } from "../utils/commonFunction";
import { CAUnifiedBalanceContext, CAContext } from "../context";
import Decimal from "decimal.js";

const useUnifiedBalance = () => {
  const { ca, ready } = useContext(CAContext);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<UserAsset[]>([]);
  const [balance, setBalance] = useState(BigInt(0));

  const refreshBalances = () => {
    if (ready && ca) {
      return ca
        .getUnifiedBalances()
        .then((val) => {
          setBalances(val);
          setLoading(false);
          const ethBalance = val.find((b) => b.symbol.toLowerCase() === "eth");
          if (ethBalance) {
            setBalance(
              BigInt(
                new Decimal(ethBalance.balance)
                  .mul(Decimal.pow(10, 18))
                  .toString()
              )
            );
          }
        })
        .catch((e) => {
          console.error("error getting unified balances", e);
        });
    }
  };

  const getAssetBalance = (asset: string) => {
    if (balances.length) {
      return balances.find(
        (b) => b.symbol.toLowerCase() === asset.toLowerCase()
      );
    }
    return undefined;
  };

  useEffect(() => {
    refreshBalances();
    const idx = setAsyncInterval(async () => {
      try {
        await refreshBalances();
      } catch (e) {}
    }, 20000);

    return () => {
      clearAsyncInterval(idx);
    };
  }, [ready, ca]);

  return {
    balance,
    balances,
    loading,
    getAssetBalance,
  };
};

const useBalance = () => {
  const { setVisible } = useContext(CAUnifiedBalanceContext);

  const showBalance = () => {
    setVisible(true);
  };

  const hideBalance = () => {
    setVisible(false);
  };

  return {
    showBalance,
    hideBalance,
  };
};
export { useUnifiedBalance, useBalance };
