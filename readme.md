# Chain Abstraction (Wagmi PnP)

The Arcana `ca-wagmi` SDK simplifies Web3 apps built with the Wagmi library by providing a unified balance across blockchains through an easy-to-use `useBalance` modal. It also replaces the `useSendTransaction` and `useWriteContract` hooks to support chain-abstracted transactions. 

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

// Replaces `wagmi` hook: `useSendTransaction`
const { sendTransaction, sendTransactionAsync } = useSendTransaction() 

// Replaces `wagmi` hook: `useWriteContract`
const { writeContract, writeContractAsync } = useWriteContract() 
```

### Arcana hooks

#### `useBalance({ symbol: string })`

##### Parameters

> |  Name  | Required |  Type  |                Description                |
> |--------|----------|--------|-------------------------------------------|
> | symbol |   yes    | string | Should be one of the supported currencies |

##### Response

> | Parameter   |            Type           |
> |-------------|---------------------------|
> | loading     |         `boolean`         |
> | value       | `UseBalanceValue \| null` |
> | error       |      `Error \| null`      |

##### Usage

> ```javascript
>  import { useBalance } from "@arcana/ca-wagmi"
>
>  const balance = useBalance({ symbol: "eth" })
> ```

##### Sample output

> ```js
> {
>   loading: false,
>   value: {
>     symbol: "ETH",
>     decimals: 18,
>     formatted: "0.000785657313049966"
>     value: 785657313049966n,
>     breakdown: [
>       {
>         chain: {
>           id: 1,
>           name: "Ethereum",
>           logo: "..."
>         },
>         formatted: "0.000785657313049966",
>         address: "0x0000000000000000000000000000000000000000",
>         value: 785657313049966n
>       }
>     ]
>   },
>   error: null
> }
> ```

#### `useBalances()`

##### Parameters

> |  Name  | Required |  Type  | Description |
> |--------|----------|--------|-------------|
> |  None  |   None   |  None  |     None    |

##### Response

> | Parameter   |           Type              |
> |-------------|-----------------------------|
> | loading     |         `boolean`           |
> | value       | `UseBalanceValue[] \| null` |
> | error       |       `Error \| null`       |

##### Usage

> ```javascript
>  import { useBalances } from "@arcana/ca-wagmi"
>
>  const balances = useBalances()
> ```

##### Sample output

> ```js
> {
>   loading: false,
>   value: [{
>     symbol: "ETH",
>     decimals: 18,
>     formatted: "0.000785657313049966"
>     value: 785657313049966n,
>     breakdown: [
>       {
>         chain: {
>           id: 1,
>           name: "Ethereum",
>           logo: "..."
>         },
>         formatted: "0.000785657313049966",
>         address: "0x0000000000000000000000000000000000000000",
>         value: 785657313049966n
>       }
>     ]
>   }],
>   error: null
> } 
> ```

#### `useBalanceModal()`

##### Parameters

> | Name | Required | Type | Description |
> |------|----------|------|-------------|
> | None |   None   | None |     None    |

##### Response

> |   Parameter   |     Type     |
> |---------------|--------------|
> | showModal     | `() => void` |
> | hideModal     | `() => void` |

##### Usage

> ```javascript
>  import { useBalanceModal } from "@arcana/ca-wagmi"
>
>  const { showModal, hideModal } = useBalanceModal()
> ```

#### `useCAFn()`

##### Parameters

> | Name | Required | Type | Description |
> |------|----------|------|-------------|
> | None |   None   | None |     None    |

##### Response

> |  Parameter |                                    Type                                  |
> |------------|--------------------------------------------------------------------------|
> | bridge     | `({ token: string, amount: string, chain: number }) => Promise<unknown>` |
> | transfer   | `({ token: string, amount: string, chain: number, to: "0x${string}" }) => Promise<unknown>` |

##### Usage

> ```javascript
>  import { useCAFn } from "@arcana/ca-wagmi"
>
>  const { bridge, transfer } = useCAFn()
> 
>  await bridge({
>    token: "usdt",
>    amount: "1.5",
>    chain: 42161
>  })
> 
>  const hash = await transfer({
>    to: "0x80129F3d408545e51d051a6D3e194983EB7801e8",
>    token: "usdt",
>    amount: "1.5",
>    chain: 10
>  })
> ```
