const main = async () => {
  const [ deployer ] = await ethers.getSigners();
  const accountBalance = await deployer.provider.getBalance(deployer.address);
  
  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  
  const tokenContractFactory = await hre.ethers.getContractFactory("TokenFactory");
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.waitForDeployment();
  const contractAddress = await tokenContract.getAddress();
  
  console.log("Token Factory address: ", contractAddress);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();