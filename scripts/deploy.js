// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balanceInEth = ethers.utils.formatEther(await deployer.getBalance());
  console.log("Account Balance: ", balanceInEth);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Ticket = await hre.ethers.getContractFactory("TicketSystem");
  const ticket = await Ticket.deploy();

  await ticket.deployed();

  console.log(
    `Ticket System contract deployed to ${ticket.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
