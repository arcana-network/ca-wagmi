# CA PnP for wagmi

## Quick start

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { CAProvider } from '@arcana/ca-wagmi'
import { App } from "./App"

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CAProvider>
          <App />
        </CAProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

```ts
App.jsx

// import { useSendTransaction } from 'wagmi'
import { useSendTransaction } from '@arcana/ca-wagmi'
import { parseEther } from 'viem'

function App() {
  const { sendTransaction } = useSendTransaction()

  return (
    <button
      onClick={() =>
        sendTransaction({
          to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
          value: parseEther('0.01'),
        })
      }
    >
      Send transaction
    </button>
  )
}
```

## Hooks

### Wagmi hook replacements

```ts
import { useSendTransaction, useWriteContract } from "@arcana/ca-wagmi"

// has same API as wagmi `useSendTransaction`
const { sendTransaction } = useSendTransaction() 

// has same API as wagmi `useWriteContract`
const { writeContract } = useWriteContract() 
```

### Arcana hooks

```ts
import { useBalance, useCAFn, useUnifiedBalance } from "@arcana/ca-wagmi"

// Balance modal show and hide
const { showBalance, hideBalance } = useBalance();

// Balances for supported assets across supported chains
const { balance, balances, getAssetBalance, loading } = useUnifiedBalance();

// Helper functions for transfer and bridge
const { tranfer, bridge } = useCAFn()
```
