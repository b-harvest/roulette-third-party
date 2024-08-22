require("dotenv").config();
const { Web3 } = require("web3");
const web3 = new Web3(process.env.RPC_URL);

const sendingBera = require("./src/sendBera.js");
const getBoosted = require("./src/isDelegator.js");
const getYeetard = require("./src/checkYeetard.js");

const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT;

const valiAddress = process.env.VALIDATOR_ADDRESS;

app.get("/checkaddr/:address", async (req, res) => {
  const address = req.params.address;
  if (!web3.utils.isAddress(address)) {
    return res.status(400).send("Invalid address");
  }
  try {
    const isDelegate = await getBoosted(address, valiAddress);
    console.log(isDelegate);
    if (isDelegate > 0) {
      res.status(200).json({
        status: "OK",
        address: address,
        amount: isDelegate,
      });
    } else {
      res.status(404).send("Address not found or no boost amount");
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

app.get("/haveYeetard/:address", async (req, res) => {
  const address = req.params.address;
  if (!web3.utils.isAddress(address)) {
    return res.status(400).send("Invalid address");
  }
  try {
    const haveNFT = await getYeetard(address);
    console.log(haveNFT);
    if (haveNFT >= 0) {
      res.status(200).json({
        status: "OK",
        address: address,
        amount: haveNFT,
      });
    } else {
      res.status(404).send("Address not found or no boost amount");
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
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

app.listen(port, () => console.log(`listening on port ${port}`));
