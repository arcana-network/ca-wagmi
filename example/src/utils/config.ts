import { Network } from "@arcana/ca-sdk";
import { http, createConfig } from "wagmi";
import {
  mainnet,
  optimism,
  base,
  arbitrum,
  scroll,
  linea,
  polygon,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
  baseSepolia,
} from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    scroll,
    linea,
    polygon,
    // Testnet chains (supported in folly)
    arbitrumSepolia,
    optimismSepolia,
    polygonAmoy,
    baseSepolia,
  ],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [scroll.id]: http(),
    [linea.id]: http(),
    [polygon.id]: http(),
    // Testnet chains (supported in folly)
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export const network = Network.CORAL;
