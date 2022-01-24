import {Cluster, clusterApiUrl, Connection} from '@solana/web3.js';
import {Keypair} from '@solana/web3.js';
import axios from 'axios';
import bs58 from 'bs58';
import _ from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import useSWR from 'swr';
import {SOLANA_NETWORKS} from 'types';
import {JupiterSwapClient, OrcaSwapClient, SwapResult} from './swap';
import {useLocalStorage} from './useLocalStorage';

interface WalletBalance {
  sol_balance: number;
  usdc_balance: number;
  orca_balance: number;
}

export interface Order {
  side: 'buy' | 'sell';
  size: number;
  fromToken: string;
  toToken: string;
}

export const SERUM_RPC_URL = 'https://solana-api.projectserum.com/';

const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ORCA_MINT_ADDRESS = 'orcarKHSqC5CDDsGbho8GKvwExejWHxTqGzXgcewB9L';

export const SOL_DECIMAL = 10 ** 9;
export const USDC_DECIMAL = 10 ** 6;
export const ORCA_DECIMAL = 10 ** 6;

export const useExtendedWallet = (
  useLive = false,
  cluster: Cluster,
  price: number = 0,
) => {
  const [secretKey, setSecretKey] = useLocalStorage('secretKey', undefined);

  const [keyPair, setKeyPair] = useState<Keypair>(Keypair.generate());
  useEffect(() => {
    if (secretKey) {
      let arr = Uint8Array.from(bs58.decode(secretKey));
      const key = Keypair.fromSecretKey(arr);
      setKeyPair(key);
    } else {
      const temp = Keypair.generate(); // The mock uses a random keypair to be able to get real market data.
      setKeyPair(temp);
    }
  }, [secretKey]);

  const [balance, setBalance] = useState<WalletBalance>({
    sol_balance: 10 * SOL_DECIMAL,
    usdc_balance: 1400 * USDC_DECIMAL,
    orca_balance: 0, // just because of the devnet deps.
  });

  const [orderBook, setOrderbook] = useState<Order[]>([]);

  const {data, mutate} = useSWR(
    () => `/balance/${keyPair?.publicKey}`, // Cache key base on the keypair.
    balanceFetcher(keyPair!, cluster),
    {
      refreshInterval: 5000,
    },
  );

  useEffect(() => {
    mutate(); // Refresh balance
  }, [cluster]);

  useEffect(() => {
    if (data && useLive) {
      /**
       * Documentation for  _.get https://lodash.com/docs/4.17.15#get
       */
      const sol_balance = _.get(data, 'data[0].result.value', 0);
      const usdc_balance = _.get(
        data,
        'data[1].result.value[0]account.data.parsed.info.tokenAmount.amount',
        0,
      );
      const orca_balance = _.get(
        data,
        'data[2].result.value[0]account.data.parsed.info.tokenAmount.amount',
        0,
      );
      setBalance({sol_balance, usdc_balance, orca_balance});
    }
  }, [data]);

  /**
   * The Jupiter SDK gives access to 10+ DEXes with more than 6bn in liquidity, allowing developers to find the best swap route with a simple API call.
   */
  const [jupiterSwapClient, setJupiterSwapClient] =
    useState<JupiterSwapClient | null>(null);

  /**
   *  Since jup.ag does not support devnet yet, we'll use Orca for devnet swaps.
   */
  const [orcaSwapClient, setOrcaSwapClient] = useState<OrcaSwapClient | null>(
    null,
  );

  // useEffect(() => {
  //   (async function _init(): Promise<void> {
  //     console.log('Keypair changed to: ', keyPair?.publicKey.toBase58());
  //     console.log('setting up clients');
  //     setJupiterSwapClient(null);
  //     setOrcaSwapClient(null);
  //     await getOrcaSwapClient();
  //     await getJupiterSwapClient();
  //     console.log('clients initialized');
  //   })();
  // }, [keyPair]);

  const getOrcaSwapClient = async () => {
    console.log('setting up orca client');
    if (orcaSwapClient) return orcaSwapClient;
    const _orcaSwapClient = new OrcaSwapClient(
      keyPair,
      new Connection(clusterApiUrl('devnet'), 'confirmed'),
    );
    setOrcaSwapClient((c) => _orcaSwapClient);
    return _orcaSwapClient;
  };

  const getJupiterSwapClient = async () => {
    console.log('setting up jupiter client');
    if (jupiterSwapClient) return jupiterSwapClient;
    const _jupiterSwapClient = await JupiterSwapClient.initialize(
      // Why not use clusterApiUrl('mainnet') over projectserum? Because mainnet public endpoints have rate limits at the moment.
      // solana--mainnet--rpc.datahub.figment.io/apikey/7087b9e27d60870a58c8c9114935017d
      new Connection(SERUM_RPC_URL, 'confirmed'),
      // new Connection(
      //   'https://solana--mainnet--rpc.datahub.figment.io/apikey/7087b9e27d60870a58c8c9114935017d/',
      //   'confirmed',
      // ),

      SOLANA_NETWORKS.MAINNET,
      keyPair,
      SOL_MINT_ADDRESS,
      USDC_MINT_ADDRESS,
    );
    setJupiterSwapClient((c) => _jupiterSwapClient);
    return _jupiterSwapClient;
  };

  const addMockOrder = async (order: Order): Promise<SwapResult> => {
    const _jupiterSwapClient = await getJupiterSwapClient();

    // TokenA === SOL
    // TokenB === USDC
    const routes = await _jupiterSwapClient?.getRoutes({
      inputToken:
        order.side === 'buy'
          ? _jupiterSwapClient.tokenB
          : _jupiterSwapClient.tokenA,
      outputToken:
        order.side === 'buy'
          ? _jupiterSwapClient.tokenA
          : _jupiterSwapClient.tokenB,
      inputAmount: order.size,
      slippage: 1,
    });
    console.log('routes:', routes);
    const bestRoute = routes?.routesInfos[0];
    console.log('bestRoute:', bestRoute);
    const result = {
      inAmount: bestRoute?.inAmount || 0,
      outAmount: bestRoute?.outAmount || 0,
      txIds: ['mockTransaction_XXXXX'],
    };

    // Balance change for the mock wallet. This is not an actual transaction.
    setBalance((previousBalance) => ({
      ...previousBalance,
      usdc_balance:
        order.side === 'buy'
          ? previousBalance.usdc_balance - result.inAmount
          : previousBalance.usdc_balance + result.outAmount,
      sol_balance:
        order.side === 'buy'
          ? previousBalance.sol_balance + result.outAmount
          : previousBalance.sol_balance - result.inAmount,
    }));

    return result;
  };

  const addOrder = useCallback(
    async (order: Order) => {
      console.log('addOrder', useLive, order, cluster);
      let result: SwapResult;
      if (!useLive) {
        result = await addMockOrder(order);
      } else if (useLive) {
        if (cluster === 'devnet') {
          console.log('HERE', cluster, useLive);
          const _orcaClient = await getOrcaSwapClient();
          if (order.side === 'buy') {
            result = await _orcaClient?.buy(order.size)!;
            console.log('result', result);
          } else if (order.side === 'sell') {
            console.log(_orcaClient);
            result = await _orcaClient?.sell(order.size)!;
          } else {
            console.log('WTF');
          }
        } else if (cluster === 'mainnet-beta') {
          console.log(jupiterSwapClient?.keypair.publicKey.toString());
          const _jupiterSwapClient = await getJupiterSwapClient();
          console.log(_jupiterSwapClient?.keypair.publicKey.toString());
          if (order.side === 'buy') {
            result = await _jupiterSwapClient?.buy(order.size);
          } else if (order.side === 'sell') {
            result = await _jupiterSwapClient?.sell(order.size);
          }
        }
      }
      if (result!) {
        const extendedOrder = {...order, ...result};
        setOrderbook((_orderBook) => [extendedOrder, ..._orderBook]);
      }
    },
    [useLive, cluster, keyPair],
  );

  const resetWallet = (params = {sol_balance: 10, usdc_balance: 1400}) => {
    if (useLive) {
      // setSecretKey(undefined);
    } else {
      setBalance({
        sol_balance: params.sol_balance * SOL_DECIMAL,
        usdc_balance: params.usdc_balance * USDC_DECIMAL,
        orca_balance: 0,
      });
    }
  };

  return {
    balance,
    resetWallet,
    keyPair,
    setSecretKey,
    addOrder,
    orderBook,
  };
};

const balanceFetcher = (keyPair: Keypair, cluster: Cluster) => () =>
  axios({
    url: cluster === 'devnet' ? clusterApiUrl(cluster) : SERUM_RPC_URL,
    // url: 'https://dh--solana-testnet--1.datahub.figment.io/apikey/7087b9e27d60870a58c8c9114935017d/',
    // url: 'https://solana--devnet.datahub.figment.io/apikey/7087b9e27d60870a58c8c9114935017d/',
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    data: [
      {
        jsonrpc: '2.0',
        id: 0,
        method: 'getBalance', // SOL balance.
        params: [keyPair?.publicKey.toBase58()],
      },
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner', // https://docs.solana.com/developing/clients/jsonrpc-api#gettokenaccountsbyowner
        params: [
          keyPair?.publicKey.toBase58(),
          {
            mint:
              cluster === 'mainnet-beta'
                ? USDC_MINT_ADDRESS
                : 'EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1', // Orca devnet pool USDC equivalent token mint address.
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'getTokenAccountsByOwner', // https://docs.solana.com/developing/clients/jsonrpc-api#gettokenaccountsbyowner
        params: [
          keyPair?.publicKey.toBase58(),
          {
            mint: ORCA_MINT_ADDRESS, // Required as a midway swap token for devnet swaps using Orca.
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      },
    ],
  });
