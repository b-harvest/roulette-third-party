require("dotenv").config({ path: "../.env" });

const { Web3 } = require("web3");

// Need a Arbitrum RPC
const web3 = new Web3(process.env.ARBITRUM_RPC);

const contractAddress = process.env.YEETARD_CONTRACT;
const yeetardABI = require("../abis/yeetard.json");
const contract = new web3.eth.Contract(yeetardABI, contractAddress);

async function getYeetard(address) {
  try {
    const manyNFT = await contract.methods.balanceOf(address).call();
    return Number(manyNFT);
  } catch (err) {
    console.log(err);
  }
}

module.exports = getYeetard;
