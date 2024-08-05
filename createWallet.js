const { Web3 } = require("web3");
const web3 = new Web3("https://bartio.rpc.berachain.com:443");

function createWallet() {
  const wallet = web3.eth.accounts.create();
  console.log("address:", wallet.address);
  console.log("private Key:", wallet.privateKey);
}
createWallet();
