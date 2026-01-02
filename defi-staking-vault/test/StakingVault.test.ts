import { describe, it } from "node:test";
import { expect } from "chai";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("StakingVault", function () {
    async function deployFixture() {
        // Connect to the network and get viem instance
        const connection = await network.connect();
        const viem = connection.viem;
        const networkHelpers = connection.networkHelpers;

        const [ownerClient, userClient] = await viem.getWalletClients();
        const owner = ownerClient;
        const user = userClient;

        // Deploy Mock ERC20 Token
        const token = await viem.deployContract("MockERC20", []);

        // Deploy Staking Vault
        const vault = await viem.deployContract("StakingVault", [token.address]);

        // Transfer tokens to user for staking
        const transferAmount = parseEther("1000");
        await token.write.transfer([user.account.address, transferAmount]);

        // Fix insolvency bug: Transfer reward pool to vault (1000 tokens)
        const rewardPool = parseEther("1000");
        await token.write.transfer([vault.address, rewardPool]);

        return { token, vault, owner, user, viem, networkHelpers };
    }

    it("allows user to stake tokens", async function () {
        const connection = await network.connect();
        const { token, vault, user } = await connection.networkHelpers.loadFixture(deployFixture);
        const amount = parseEther("100");

        // Approve vault to spend tokens
        await token.write.approve([vault.address, amount], {
            account: user.account,
        });

        // Stake tokens
        await vault.write.stake([amount], {
            account: user.account,
        });
        const vaultTokenBalance = await token.read.balanceOf([vault.address]);
        expect(vaultTokenBalance).to.equal(amount + parseEther("1000")); // Including reward pool

        // Check balances
        const userBalance = await vault.read.userBalance([user.account.address]);
        const totalStaked = await vault.read.totalStaked();

        expect(userBalance).to.equal(amount);
        expect(totalStaked).to.equal(amount);
    });

    it("allows user to withdraw tokens", async function () {
        const connection = await network.connect();
        const { token, vault, user } = await connection.networkHelpers.loadFixture(deployFixture);
        const amount = parseEther("100");

        // Approve and stake
        await token.write.approve([vault.address, amount], {
            account: user.account,
        });
        await vault.write.stake([amount], {
            account: user.account,
        });

        // Withdraw tokens
        await vault.write.withdraw([amount], {
            account: user.account,
        });
        const vaultTokenBalance = await token.read.balanceOf([vault.address]);
        expect(vaultTokenBalance).to.equal(parseEther("1000")); // Only reward pool remains

        // Check balances
        const userBalance = await vault.read.userBalance([user.account.address]);
        const totalStaked = await vault.read.totalStaked();

        expect(userBalance).to.equal(0n);
        expect(totalStaked).to.equal(0n);
    });

    it("accrues rewards correctly over time", async function () {
        const connection = await network.connect();
        const { vault, token, owner, user, networkHelpers } = await connection.networkHelpers.loadFixture(deployFixture);
        const amount = parseEther("100");

        // Owner sets reward rate = 1 token/sec
        await vault.write.setRewardRate([parseEther("1")], {
            account: owner.account,
        });

        // Approve vault to spend tokens
        await token.write.approve([vault.address, amount], {
            account: user.account,
        });
        // Stake tokens
        await vault.write.stake([amount], {
            account: user.account,
        });

        // Advance time by 10 seconds
        await networkHelpers.time.increase(10);

        // Check earned rewards
        const earned = await vault.read.earned([user.account.address]);

        // Expect exactly 10 tokens
        expect(earned).to.equal(parseEther("10"));
    });

    it("allows user to claim rewards and resets balance correctly", async function () {
        const connection = await network.connect();
        const { vault, token, owner, user, networkHelpers } = await connection.networkHelpers.loadFixture(deployFixture);
        const stakeAmount = parseEther("100");

        // Set reward rate: 1 token per second
        await vault.write.setRewardRate([parseEther("1")], {
            account: owner.account,
        });

        // Approve + stake
        await token.write.approve([vault.address, stakeAmount], {
            account: user.account,
        });

        await vault.write.stake([stakeAmount], {
            account: user.account,
        });

        // Move time forward by 10 seconds
        await networkHelpers.time.increase(10);

        // Record user token balance BEFORE claim
        const balanceBefore = await token.read.balanceOf([user.account.address]);

        // Claim rewards
        await vault.write.claimRewards({
            account: user.account,
        });

        // Record user token balance AFTER claim
        const balanceAfter = await token.read.balanceOf([user.account.address]);

        // User should receive at least 10 tokens (might be slightly more due to block timestamp)
        const received = balanceAfter - balanceBefore;
        expect(received >= parseEther("10")).to.be.true;

        // Rewards should reset to zero
        const remainingRewards = await vault.read.rewards([user.account.address]);
        expect(remainingRewards).to.equal(0n);
    });
    
    it("prevents double claiming rewards", async function () {
        const connection = await network.connect();
        const { vault, token, owner, user, networkHelpers } = await connection.networkHelpers.loadFixture(deployFixture);
        const stakeAmount = parseEther("100");

        await vault.write.setRewardRate([parseEther("1")], {
            account: owner.account,
        });

        await token.write.approve([vault.address, stakeAmount], {
            account: user.account,
        });

        await vault.write.stake([stakeAmount], {
            account: user.account,
        });

        await networkHelpers.time.increase(5);

        await vault.write.claimRewards({
            account: user.account,
        });

        // Try to claim again immediately - should fail with "No rewards"
        try {
            await vault.write.claimRewards({ account: user.account });
            expect.fail("Expected transaction to revert with 'No rewards'");
        } catch (error: any) {
            expect(error.message).to.include("No rewards");
        }
    });
});