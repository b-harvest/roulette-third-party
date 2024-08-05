require("dotenv").config();
const { Web3 } = require("web3");
const web3 = new Web3(process.env.RPC_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const bgtABI = require("../abis/bgt.json");
const contract = new web3.eth.Contract(bgtABI, contractAddress);

async function getBoosted(address, valiAddress) {
  try {
    const boostedMtd = await contract.methods
      .boosted(address, valiAddress)
      .call();

    return Number(boostedMtd);
  } catch (err) {
    console.log(err);
  }
}

module.exports = getBoosted;
