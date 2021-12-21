import {ethers} from 'ethers';

declare let window: {
  ethereum: ethers.providers.ExternalProvider;
};

// A random test's address
const RECIPIENT = '0xb11D554F2139d843F5c94a3185d17C4d5762a7c7';
// 0.1 MATIC
const AMOUNT = '0.1';

const transfer = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const send_account = provider.getSigner().getAddress();

    const currentGasPrice = await provider.getGasPrice();
    const gas_price = ethers.utils.hexlify(
      parseInt(currentGasPrice.toString()),
    );

    const transaction = {
      from: send_account,
      to: RECIPIENT,
      value: ethers.utils.parseEther(AMOUNT),
      nonce: provider.getTransactionCount(send_account, 'latest'),
      gasLimit: ethers.utils.hexlify(100000),
      gasPrice: gas_price,
    };
    const hash = await provider.getSigner().sendTransaction(transaction);
    const receipt = await hash.wait();
    return {hash: receipt.transactionHash};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default transfer;
