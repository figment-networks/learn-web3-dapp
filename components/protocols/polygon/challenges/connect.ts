import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const connect = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
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
