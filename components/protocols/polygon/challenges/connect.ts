import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

const connect = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (provider) {
      await provider.send('eth_requestAccounts', []); //this method requests for a user to connect his metamask
      const signer = provider.getSigner(); //represents the current account
      const address = await signer.getAddress(); //gets address of current account
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
