import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function main() {
  // Load artifacts
  const MockERC20 = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/MockERC20.sol/MockERC20.json"),
      "utf-8"
    )
  );
  
  const StakingVault = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/StakingVault.sol/StakingVault.json"),
      "utf-8"
    )
  );

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  console.log("Deploying from account:", account.address);
  console.log("\nDeploying MockERC20 token...");

  // Deploy MockERC20
  const tokenHash = await walletClient.deployContract({
    abi: MockERC20.abi,
    bytecode: MockERC20.bytecode as `0x${string}`,
    args: [],
  });

  const tokenReceipt = await publicClient.waitForTransactionReceipt({ hash: tokenHash });
  const tokenAddress = tokenReceipt.contractAddress!;
  console.log("✅ MockERC20 deployed to:", tokenAddress);

  console.log("\nDeploying StakingVault...");

  // Deploy StakingVault
  const vaultHash = await walletClient.deployContract({
    abi: StakingVault.abi,
    bytecode: StakingVault.bytecode as `0x${string}`,
    args: [tokenAddress],
  });

  const vaultReceipt = await publicClient.waitForTransactionReceipt({ hash: vaultHash });
  const vaultAddress = vaultReceipt.contractAddress!;
  console.log("✅ StakingVault deployed to:", vaultAddress);

  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log("Network: Sepolia");
  console.log("MockERC20 Address:", tokenAddress);
  console.log("StakingVault Address:", vaultAddress);
  console.log("========================================");
  console.log("\n📝 Update your frontend contracts.ts with these addresses!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
