import SimpleStorageJson from 'contracts/polygon/SimpleStorage/SimpleStorage.json';
import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const getValue = async (contractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      SimpleStorageJson.abi,
      signer,
    );
    const value = await contract.get();
    return {value};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default getValue;
