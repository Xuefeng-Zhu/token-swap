// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const users = [];
  const allocations = [];

  await deploy('ERC20', {
    from: deployer,
    args: ["USD Coin", "USDC"],
    log: true,
  });

  const token = await deployments.get("ERC20");


  await deploy('TokenSwap', {
    from: deployer,
    args: [users, allocations, token.address],
    log: true,
  });
};

func.tags = ['TokenSwap'];
module.exports = func;
