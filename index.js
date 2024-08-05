const { Web3 } = require("web3");
const web3 = new Web3("https://bartio.rpc.berachain.com:443");

const bgtABI = require("./abis/bgt.json");
const sendingBera = require("./sendBera.js");
// console.log(RewardVaultABI);

const express = require("express");
const app = express();
app.use(express.json());

const contractAddress = "0xbDa130737BDd9618301681329bF2e46A016ff9Ad";
const valiAddress = "0x61AF17565b671e9b84869615d6889F1Eb7eDe223";

const contract = new web3.eth.Contract(bgtABI, contractAddress);
// console.log(contract.methods.boosted(account, validator).call());

async function getBoosted(account, validator) {
  try {
    const boostedMtd = await contract.methods
      .boosted(account, validator)
      .call();

    return Number(boostedMtd);
  } catch (err) {
    console.log(err);
  }
}
// sendingBera();
// async function sendBera(fromAddres, toAddress, amount, privateKey) {
//   try {
//     const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
//     const gasPrice= await web3.eth.getGasPrice();

//     const unsignTx = {
//       'to' : toAddress,
//       'value' : web3.utils.toWei(amount, 'ether'),
//       'gas' : 21000,
//       'gasPrice' : gasPrice,
//       'nonce' : nonce,
//       'chainId': beraId,
//     }
//     const signedTx = await web3.eth.accounts.signTransaction(unsignTx, privateKey);
//     const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//     console.log(`${tx.transactionHash} succesful`)
//     return tx.transactionHash;
//   }catch (err) {
//     console.log('error sending tx', err)
//   }
// }

app.get("/checkaddr/:address", async (req, res) => {
  const address = req.params.address;
  if (!web3.utils.isAddress(address)) {
    return res.status(400).send("Invalid address");
  }
  try {
    const isDelegate = await getBoosted(address, valiAddress);
    if (isDelegate > 0) {
      res.status(200).json({
        status: "OK",
        address: address,
        amount: isDelegate,
      });
    }
  } catch (err) {
    res.status(500).send("Error fetching", err);
  }
});

app.post("/winning", async (req, res) => {
  const { address, amount } = req.body;

  // account validation
  if (!web3.utils.isAddress(address)) {
    return res.status(400).send("Invalid address");
  } else if (Number(amount) <= 0) {
    return res.status(400).send("amount must be higher than 0 ");
  } else if (!amount || !address) {
    return res.status(400).send("address and amount are required");
  }

  try {
    const isWinning = await sendingBera(address, amount);
    res.status(200).json({
      status: "OK",
      address: address,
      amount: amount,
      Tx_Hash: `${isWinning}`,
    });
  } catch (err) {
    res.status(500).send("Error fetching", err);
  }
});

app.listen(3000, () => console.log(`listening on port 3000`));
