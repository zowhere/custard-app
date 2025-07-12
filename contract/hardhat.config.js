require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork : 'primordial',
  networks: {
    primordial: {
      url: "https://rpc.primordial.bdagscan.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },

};
