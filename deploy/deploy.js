const csv = require('csvtojson');
const { ethers } = require('hardhat');

// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('MockERC20', {
    from: deployer,
    args: ['USD Coin', 'USDC'],
    log: true,
  });

  const token = await ethers.getContract('MockERC20', deployer);

  await deploy('TokenSwap', {
    from: deployer,
    args: [token.address],
    log: true,
  });

  const tokenSwap = await ethers.getContract('TokenSwap', deployer);
  const balances = await csv().fromFile('./balances.csv');
  for (let i = 0; i < balances.length; i += 100) {
    console.log('setAllocations', i);
    const curBalances = balances.slice(i, i + 100);
    await tokenSwap.setAllocations(
      curBalances.map((item) => item.HolderAddress),
      curBalances.map((item) => item.Balance)
    );
  }

  console.log('mint');
  await token.mint(tokenSwap.address, '9999999999999999999999999');
  await tokenSwap.startSwap();
};

func.tags = ['TokenSwap'];
module.exports = func;
