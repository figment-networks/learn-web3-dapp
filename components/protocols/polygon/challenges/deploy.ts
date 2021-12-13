import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const deploy = async (contract: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.getCode(contract);
    return {
      status: true,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default deploy;
