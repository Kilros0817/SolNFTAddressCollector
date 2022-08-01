const solanaWeb3 = require("@solana/web3.js");
const fs = require("fs");
const searchAddress = "CYpwfWrLXM7r5rgLUsbNQq6s8syGdV4WnwF55hT6i5y7"; //example 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg'

const endpoint =
  "https://hidden-small-pine.solana-mainnet.discover.quiknode.pro/979ee002d0765c17d445ac307859f16bcb5868b5/";
const solanaConnection = new solanaWeb3.Connection(endpoint);

const getTransactions = async (address) => {
  const pubKey = new solanaWeb3.PublicKey(address);
  const recentSig = fs.readFileSync("recentSlot.txt", "utf8");

  let transactionList = await solanaConnection.getSignaturesForAddress(
    pubKey,
    {until: recentSig},
    "confirmed"
  );

  const newSig = transactionList[0].signature;

  fs.writeFile("recentSlot.txt", `${newSig}`, function (err) {
    if (err) throw err;
  });

  fs.writeFile("tokenList.txt", '', function (err) {
    if (err) throw err;
  });

  transactionList.forEach(async (transaction, i) => {
    const tx = await solanaConnection.getParsedTransaction(
      transaction.signature
    );
    const err = tx.meta.err;

    if (err == null) {
      const accountKeys = tx.transaction.message.instructions[0].accounts;
      const tokenAddress = accountKeys[5].toBase58();
      fs.appendFile("tokenList.txt", `${tokenAddress}\n`, function (err) {
        if (err) throw err;
      });
    }
  });
};

getTransactions(searchAddress);
