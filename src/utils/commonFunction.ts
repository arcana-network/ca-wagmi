import { MAINNET_CHAINS } from "./constants";

const getLogo = (logoName?: string): string => {
  const logoPath = logoName ? `/assets${logoName}` : undefined;

  const logoUrl = logoPath ? logoPath : undefined;

  if (logoUrl) {
    return logoUrl as string;
  } else {
    console.warn(`Logo for ${logoName} not found, using default.`);
    return "/assets/images/logos/default.svg";
  }
};

const isMaxAllowance = (allowance: string | number | bigint): boolean => {
  const maxAllowancePrefix =
    "115792089237316195423570985008687907853269984665640564039457";
  return allowance.toString().startsWith(maxAllowancePrefix);
};

const getChainDetails = (chainID: number | undefined) => {
  if (chainID) {
    const chainDetails = MAINNET_CHAINS.filter((item) => item.id === chainID);
    return chainDetails[0];
  }
};

const formatNumber = (val: number) => {
  return Intl.NumberFormat().format(val);
};

const asyncIntervals: Array<boolean> = [];

const runAsyncInterval = async (
  cb: () => Promise<void>,
  interval: number,
  intervalIndex: number
) => {
  if (asyncIntervals[intervalIndex]) {
    await cb();
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
  }
};

const setAsyncInterval = (cb: () => Promise<void>, interval: number) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push(true);
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    return intervalIndex;
  } else {
    throw new Error("Callback must be a function");
  }
};

const clearAsyncInterval = (intervalIndex: number) => {
  if (asyncIntervals[intervalIndex]) {
    asyncIntervals[intervalIndex] = false;
  }
};

export {
  setAsyncInterval,
  clearAsyncInterval,
  formatNumber,
  getChainDetails,
  getLogo,
  isMaxAllowance,
};
