// import {
//   Config,
//   ResolvedRegister,
//   useWriteContract as internalUseWriteContract,
//   UseWriteContractParameters,
//   UseWriteContractReturnType,
// } from "wagmi";
// import { encodeFunctionData } from "viem";
// import { useCA } from "./useCA";
// import { useContext } from "react";
// import { CAErrorContext } from "../context";

// export function useWriteContract<
//   config extends Config = ResolvedRegister["config"],
//   context = unknown
// >(
//   parameters: UseWriteContractParameters<config, context> = {}
// ): UseWriteContractReturnType<config, context> {
//   const wcr = internalUseWriteContract(parameters);
//   const originalWC = wcr.writeContract;
//   const { ca } = useCA();
//   const { setError } = useContext(CAErrorContext);

//   const writeContract = (
//     variables: Parameters<typeof wcr.writeContract>[0],
//     options?: Parameters<typeof wcr.writeContract>[1]
//   ) => {
//     if (ca) {
//       const data = encodeFunctionData(variables);
//       ca.preprocess({
//         to: variables.address,
//         data: data,
//         value: variables.value
//           ? `0x${variables.value.toString(16)}`
//           : undefined,
//       })
//         .then(() => {
//           return originalWC(variables, options);
//         })
//         .catch((e) => {
//           setError(e.message);
//           // bubble ca error to wagmi?
//           // if (options?.onError) {
//           //   options.onError(e, variables);
//           // }
//         });
//       return;
//     } else {
//       return originalWC(variables, options);
//     }
//   };

//   wcr.writeContract = writeContract;
//   return wcr;
// }
