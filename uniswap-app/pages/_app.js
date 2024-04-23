import '../styles/globals.css'

import merge from 'lodash.merge'
import '@rainbow-me/rainbowkit/styles.css'



import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit'

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { localhost } from '@wagmi/core/chains';
import { providers } from 'ethers';
import ganache from 'ganache';
import  { ChainProviderFn, FallbackProviderConfig } from '@wagmi/core';

function ganacheWrapper({ priority, stallTimeout, weight } = {}) {
  return function (chain) {
    return {
      chain,
      provider: () => {
        const provider = new providers.Web3Provider(ganache.provider(), {
          chainId: chain.id,
          name: chain.network,
        });
        return Object.assign(provider, { priority, stallTimeout, weight });
      },
    };
  };
}

// It can then be used with `configureChains`
const { provider, chains } = configureChains(
  [localhost],
  [ganacheWrapper()]
);


const { connectors } = getDefaultWallets({
  appName: 'Custom Dex',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: '#18181b',
    accentColorForeground: '#fff',
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
