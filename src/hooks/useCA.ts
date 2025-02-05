import { useContext } from "react";
import { CAContext } from "../context";

export const useCA = () => {
  const ca = useContext(CAContext);
  return ca;
};
