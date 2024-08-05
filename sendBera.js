const { Web3 } = require("web3");
const web3 = new Web3("https://bartio.rpc.berachain.com:443");

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const fromAddress = process.env.FROM_ADDRESS;
const sendingWallet = web3.eth.accounts.privateKeyToAccount(privateKey).address;

// const toAddress = "0xF6EB0d21e5B381578abfc101A5b231f5c8bdf18B"; //loca address
// const amount = "0.01";

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

    console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendingBera;
