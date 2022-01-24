import {Cluster, Connection, Keypair, PublicKey} from '@solana/web3.js';
import {Jupiter, RouteInfo, TOKEN_LIST_URL} from '@jup-ag/core';
import Decimal from 'decimal.js';
import {getOrca, Network, OrcaPoolConfig} from '@orca-so/sdk';
import * as bs58 from 'bs58';

/**
 * Logging the Keypair object, you'll notice that the publicKey is a 32-byte UInt8Array & the secretKey is the entire 64-byte UInt8Array
 * The first 32 bytes of the array are the secret key and the last 32 bytes of the array are the public key
 * console.log(_account)
 *
 * This returns the entire UInt8Array of 64 bytes
 * console.log(_account.secretKey)
 *
 * The secret key in base58 encoding: 4WoxErVFHZSaiTyDjUhqd6oWRL7gHZJd8ozvWWKZY9EZEtrqxCiD8CFvak7QRCYpuZHLU8FTGALB9y5yenx8rEq3
 * console.log(bs58.encode(_account.secretKey));
 *
 * The publicKey property is either a UInt8Array or a BigNumber:
 * PublicKey { _bn: <BN: 7dfd7f354726fed61eaa4745502e344c65f622106004a427dc58b8c98ab4b5ee> }
 * console.log(_account.publicKey)
 *
 * The public key is commonly represented as a string when being used as an "address": 9UpA4MYkBw5MGfDm5oCB6hskMt6LdUZ8fUtapG6NioLH
 * console.log(_account.publicKey.toString());
 */
const _account = Keypair.fromSecretKey(
  new Uint8Array([
    175, 193, 241, 226, 223, 32, 155, 13, 1, 120, 157, 36, 15, 39, 141, 146,
    197, 180, 138, 112, 167, 209, 70, 94, 103, 202, 166, 62, 81, 18, 143, 49,
    125, 253, 127, 53, 71, 38, 254, 214, 30, 170, 71, 69, 80, 46, 52, 76, 101,
    246, 34, 16, 96, 4, 164, 39, 220, 88, 184, 201, 138, 180, 181, 238,
  ]),
); // This is given for testing purposes only. Do NOT use this keypair in any production code.

// Token interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}

// SwapResult interface
export interface SwapResult {
  inAmount: number;
  outAmount: number;
  txIds: string[];
}

/**
 * Currently, Jupiter aggregation only works with Solana mainnet.
 */
export class JupiterSwapClient {
  private jupiter: Jupiter;

  constructor(
    jupiter: Jupiter,
    public readonly tokenA: Token,
    public readonly tokenB: Token,
    public readonly keypair: Keypair,
  ) {
    this.jupiter = jupiter;
  }

  static async initialize(
    connection: Connection,
    cluster: Cluster,
    keypair: Keypair,
    tokenAMintAddress: String, // Token to buy
    tokenBMintAddress: String, // token to sell
  ) {
    const jupiter = await Jupiter.load({connection, cluster, user: keypair});
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[cluster])).json(); // Fetch token list from Jupiter API
    const inputToken = tokens.find((t) => t.address == tokenAMintAddress); // Buy token
    const outputToken = tokens.find((t) => t.address == tokenBMintAddress); // Sell token
    console.log('Input token:', inputToken);
    console.log('Output token:', outputToken);
    console.log('Keypair:', keypair);
    console.log(connection, cluster);
    if (!inputToken || !outputToken) {
      throw new Error('Token not found');
    }

    return new JupiterSwapClient(jupiter, inputToken, outputToken, keypair);
  }

  async getRoutes({
    inputToken,
    outputToken,
    inputAmount,
    slippage,
  }: {
    inputToken?: Token;
    outputToken?: Token;
    inputAmount: number;
    slippage: number;
  }) {
    if (!inputToken || !outputToken) {
      return null;
    }

    console.log('Getting routes');
    const inputAmountLamports = inputToken
      ? Math.round(inputAmount * 10 ** inputToken.decimals)
      : 0; // Lamports based on token decimals
    const routes =
      inputToken && outputToken
        ? await this.jupiter.computeRoutes(
            new PublicKey(inputToken.address),
            new PublicKey(outputToken.address),
            inputAmountLamports,
            slippage,
            true,
          )
        : null;

    if (routes && routes.routesInfos) {
      console.log('Possible number of routes:', routes.routesInfos.length);
      console.log('Best quote: ', routes.routesInfos[0].outAmount);
      return routes;
    } else {
      return null;
    }
  }
  // USDC -> SOL
  async buy(size: number) {
    const routes = await this.getRoutes({
      inputToken: this.tokenB, // USDC
      outputToken: this.tokenA, // SOL
      inputAmount: size, // 1 unit in UI
      slippage: 1, // 1% slippage
    });
    console.log('Routes:', routes);
    if (routes?.routesInfos) {
      console.log('Best Route', routes.routesInfos[0]);
      return this.executeSwap(routes?.routesInfos[0]);
    } else {
      throw new Error('Route not found');
    }
  }
  // SOL -> USDC
  async sell(size: number) {
    const routes = await this.getRoutes({
      inputToken: this.tokenA,
      outputToken: this.tokenB,
      inputAmount: size, // 1 unit in UI
      slippage: 1, // 1% slippage
    });
    if (routes?.routesInfos) {
      return this.executeSwap(routes?.routesInfos[0]);
    } else {
      throw new Error('Route not found');
    }
  }

  async executeSwap(route: RouteInfo) {
    // Prepare execute exchange
    const {execute} = await this.jupiter.exchange({
      route,
    });
    // Execute swap
    const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type

    if (swapResult.error) {
      console.log(swapResult.error);
      return {...swapResult, txIds: [swapResult.txId]}; // fit the swapResult interface
    } else {
      console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
      console.log(
        `inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`,
      );
      console.log(
        `inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`,
      );
    }
    return {
      txIds: [swapResult.txid],
      inAmount: swapResult.inputAmount,
      outAmount: swapResult.outputAmount,
    };
  }
}

export class OrcaSwapClient {
  constructor(
    public readonly keypair: Keypair,
    public readonly connection: Connection,
  ) {}
  /**
   * @param size A `Decimal` formatted number
   * @returns
   *  - `txIds`: [`swapTxId`, `swapOrcaTxId`]
   *  - `inAmount`: `solAmount.toNumber()`
   *  - `outAmount`: `usdcAmount.toNumber()`
   */
  async buy(size: number): Promise<SwapResult> {
    const orca = getOrca(this.connection, Network.DEVNET);
    const orcaUSDCPool = orca.getPool(OrcaPoolConfig.ORCA_USDC);
    const usdcToken = orcaUSDCPool.getTokenB();
    console.log('usdcToken', usdcToken);
    const usdcAmount = new Decimal(size);
    const usdcQuote = await orcaUSDCPool.getQuote(usdcToken, usdcAmount);
    const orcaAmount = usdcQuote.getMinOutputAmount();
    const swapOrcaPayload = await orcaUSDCPool.swap(
      this.keypair,
      usdcToken,
      usdcAmount,
      orcaAmount,
    );
    console.log(
      `Swap ${usdcAmount.toString()} USDC for at least ${orcaAmount.toNumber()} ORCA`,
    );
    const swapOrcaTxId = await swapOrcaPayload.execute();
    console.log('Swapped:', swapOrcaTxId, '\n');

    const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL); // Orca pool for SOL
    const orcaToken = orcaSolPool.getTokenA(); // SOL token
    const solAmount = new Decimal(size);
    const quote = await orcaSolPool.getQuote(orcaToken, orcaAmount);
    const solAmount = quote.getMinOutputAmount();
    console.log(
      `Swap ${orcaAmount.toNumber()} ORCA for at least ${solAmount.toString()} SOL `,
    );
    // orcaAmount is included because in the Orca smart contract there's a condition if the swap produces
    // less than the amount requested, the transaction will fail and the user will keep their SOL.
    const swapPayload = await orcaSolPool.swap(
      this.keypair,
      orcaToken,
      solAmount,
      orcaAmount,
    );

    const swapTxId = await swapPayload.execute();
    console.log('Swapped:', swapTxId, '\n');

    return {
      txIds: [swapTxId, swapOrcaTxId],
      inAmount: solAmount.toNumber(),
      outAmount: usdcAmount.toNumber(),
    };
  }
  /**
   * @param size A `Decimal` formatted number
   * @returns
   *  - `txIds`: [`swapTxId`, `swapOrcaTxId`]
   *  - `inAmount`: `solAmount.toNumber()`
   *  - `outAmount`: `usdcAmount.toNumber()`
   */
  async sell(size: number): Promise<SwapResult> {
    const orca = getOrca(this.connection, Network.DEVNET);
    const orcaSolPool = orca.getPool(OrcaPoolConfig.SOL_USDC);
    const solToken = orcaSolPool.getTokenA();
    const solAmount = new Decimal(size);
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    const orcaAmount = quote.getMinOutputAmount();
    console.log(
      `Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`,
    );
    console.log({
      keypair: this.keypair,
      solToken,
      solAmount,
      orcaAmount,
    });
    const swapPayload = await orcaSolPool.swap(
      this.keypair,
      solToken,
      solAmount,
      orcaAmount,
    );

    const swapTxId = await swapPayload.execute();
    console.log('Swapped:', swapTxId, '\n');

    const orcaUSDCPool = orca.getPool(OrcaPoolConfig.ORCA_USDC);
    const orcaToken = orcaUSDCPool.getTokenA();
    console.log('orcaToken:', orcaToken);
    const usdcQuote = await orcaUSDCPool.getQuote(orcaToken, orcaAmount);
    const usdcAmount = usdcQuote.getMinOutputAmount();
    const swapOrcaPayload = await orcaUSDCPool.swap(
      this.keypair,
      orcaToken,
      orcaAmount,
      usdcAmount,
    );
    console.log(
      `Swap ${orcaAmount.toNumber()} ORCA for at least ${usdcAmount.toNumber()} USDC`,
    );

    const swapOrcaTxId = await swapOrcaPayload.execute();
    console.log('Swapped:', swapOrcaTxId, '\n');

    return {
      txIds: [swapTxId, swapOrcaTxId],
      inAmount: solAmount.toNumber(),
      outAmount: usdcAmount.toNumber(),
    };
  }
}
