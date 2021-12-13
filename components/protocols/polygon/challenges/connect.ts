import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const connect = async () => {
  try {
    const provider = undefined;
    if (provider) {
      await undefined;
      const signer = undefined;
      const address = undefined;
      return {
        address,
      };
    } else {
      return {
        error: 'Please install Metamask at https://metamask.io',
      };
    }
  } catch (error) {
    return {
      error: 'An unexpected error occurs',
    };
  }
};

export default connect;
