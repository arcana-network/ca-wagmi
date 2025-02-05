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

### useSendTransaction

```ts
import { useSendTransaction } from "@arcana/ca-wagmi"

// has same API as wagmi `useSendTransaction`
const { sendTransaction } = useSendTransaction() 
```

### useBalance

```ts
import { useBalance } from "@arcana/ca-wagmi"

const { showBalance } = useBalance();

// displays a modal with unified balance
showBalance()
```
