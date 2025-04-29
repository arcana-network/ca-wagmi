import { CA } from "@arcana/ca-sdk";
import { Config } from "./types";

let ca: CA | null = null;

export const getCA = (config: Config = {}) => {
  if (!ca) {
    ca = new CA({ network: config.network });
  }
  return ca;
};
