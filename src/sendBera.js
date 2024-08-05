require("dotenv").config();
const { Web3 } = require("web3");
const web3 = new Web3(process.env.RPC_URL);

const privateKey = process.env.PRIVATE_KEY;
const fromAddress = process.env.FROM_ADDRESS;
const sendingWallet = web3.eth.accounts.privateKeyToAccount(privateKey).address;

async function sendingBera(toAddress, amount) {
  try {
    const nonce = await web3.eth.getTransactionCount(fromAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();

    const transaction = {
      to: toAddress,
      value: web3.utils.toWei(amount, "ether"),
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce,
      chainId: 80084, // b-artio
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    return receipt.transactionHash;
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendingBera;
