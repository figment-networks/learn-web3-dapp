export const accountExplorer = (network: string) => (address: string) => {
  return `https://mumbai.polygonscan.com/address/${address}`;
};

export const getPolygonBlockExplorerURL = (block: number) => {
  return `https://mumbai.polygonscan.com/block/${block}`;
};

export const getPolygonTxExplorerURL = (txId: string) => {
  return `https://mumbai.polygonscan.com/tx/${txId}`;
};

export const getPolygonTokenExplorerURL = (address: string) => {
  return `https://mumbai.polygonscan.com/token/${address}`;
};

export const getPolygonFaucetURL = () => {
  return `https://faucet.polygon.technology/`;
};
