import { UserAsset } from "@arcana/ca-sdk";
import { useState, useContext, useEffect } from "react";
import { clearAsyncInterval, setAsyncInterval } from "../utils/commonFunction";
import { CAUnifiedBalanceContext, CAContext } from "../context";

const useUnifiedBalance = () => {
  const { ca, ready } = useContext(CAContext);
  const [balances, setBalances] = useState<UserAsset[]>([]);

  const refreshBalances = () => {
    if (ready && ca) {
      ca.getUnifiedBalances()
        .then((val) => {
          console.log({ val });
          setBalances(val);
        })
        .catch((e) => {
          console.error("error getting unified balances", e);
        });
    }
  };

  useEffect(() => {
    refreshBalances();
    const idx = setAsyncInterval(async () => {
      try {
        if (ready && ca) {
          const b = await ca.getUnifiedBalances();
          console.log({ val: b });
          setBalances(b);
        }
      } catch (e) {}
    }, 20000);

    return () => {
      clearAsyncInterval(idx);
    };
  }, [ready, ca]);

  return {
    balances,
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
