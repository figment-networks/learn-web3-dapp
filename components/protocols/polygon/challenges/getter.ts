import SimpleStorageJson from 'contracts/polygon/SimpleStorage/SimpleStorage.json';
import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const getValue = async (contractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // try to figure out the expected parameters
    const contract = new ethers.Contract(undefined);
    // try to figure out the expected method
    const value = undefined;
    return {value};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default getValue;
