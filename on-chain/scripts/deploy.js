const { ethers } = require('hardhat')

async function main() {
  const SPPSFactory = await ethers.getContractFactory('SPPS')
  const spps = await SPPSFactory.deploy()
  await spps.waitForDeployment()
  console.log(`spps contract have been deployed on ${await spps.getAddress()} address`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
