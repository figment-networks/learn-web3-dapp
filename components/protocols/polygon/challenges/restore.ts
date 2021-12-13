import {ethers} from 'ethers';

const restore = (mnemonic: string, address?: string) => {
  try {
    const wallet = undefined;
    if (wallet.address === address) {
      const restoredAddress = wallet.address;
      return {
        restoredAddress,
      };
    } else {
      return {error: 'Unable to restore account'};
    }
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    return {error: errorMessage};
  }
};

export default restore;
