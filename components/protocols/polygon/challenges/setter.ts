import SimpleStorageJson from 'contracts/polygon/SimpleStorage/SimpleStorage.json';
import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const setValue = async (contractAddress: string, value: number) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      SimpleStorageJson.abi,
      signer,
    );
    const transactionResult = await contract.set(value);
    const receipt = await transactionResult.wait();
    return {hash: receipt.transactionHash};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default setValue;
