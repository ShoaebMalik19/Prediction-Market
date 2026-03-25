const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy(42);
    await simpleStorage.waitForDeployment();
  });

  it("sets the initial value on deployment", async function () {
    expect(await simpleStorage.value()).to.equal(42);
  });

  it("sets the deployer as owner", async function () {
    expect(await simpleStorage.owner()).to.equal(owner.address);
  });

  it("allows owner to update value", async function () {
    await simpleStorage.setValue(100);
    expect(await simpleStorage.value()).to.equal(100);
  });

  it("emits ValueUpdated event on setValue", async function () {
    await expect(simpleStorage.setValue(99))
      .to.emit(simpleStorage, "ValueUpdated")
      .withArgs(owner.address, 42, 99);
  });

  it("reverts when non-owner calls setValue", async function () {
    await expect(simpleStorage.connect(other).setValue(1)).to.be.revertedWith(
      "SimpleStorage: caller is not the owner"
    );
  });

  it("allows owner to transfer ownership", async function () {
    await simpleStorage.transferOwnership(other.address);
    expect(await simpleStorage.owner()).to.equal(other.address);
  });

  it("reverts ownership transfer to zero address", async function () {
    await expect(
      simpleStorage.transferOwnership(ethers.ZeroAddress)
    ).to.be.revertedWith("SimpleStorage: new owner is zero address");
  });
});

describe("ShardeumToken", function () {
  let token;
  let owner;
  let alice;
  let bob;

  const INITIAL_SUPPLY = 1_000_000n;
  const DECIMALS = 18n;
  const TOTAL = INITIAL_SUPPLY * 10n ** DECIMALS;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const ShardeumToken = await ethers.getContractFactory("ShardeumToken");
    token = await ShardeumToken.deploy("Shardeum Token", "SHT", INITIAL_SUPPLY);
    await token.waitForDeployment();
  });

  it("has correct name, symbol and decimals", async function () {
    expect(await token.name()).to.equal("Shardeum Token");
    expect(await token.symbol()).to.equal("SHT");
    expect(await token.decimals()).to.equal(18);
  });

  it("mints initial supply to deployer", async function () {
    expect(await token.totalSupply()).to.equal(TOTAL);
    expect(await token.balanceOf(owner.address)).to.equal(TOTAL);
  });

  it("transfers tokens correctly", async function () {
    const amount = ethers.parseEther("500");
    await token.transfer(alice.address, amount);
    expect(await token.balanceOf(alice.address)).to.equal(amount);
    expect(await token.balanceOf(owner.address)).to.equal(TOTAL - amount);
  });

  it("approves and transferFrom work", async function () {
    const amount = ethers.parseEther("200");
    await token.approve(alice.address, amount);
    expect(await token.allowance(owner.address, alice.address)).to.equal(amount);

    await token.connect(alice).transferFrom(owner.address, bob.address, amount);
    expect(await token.balanceOf(bob.address)).to.equal(amount);
  });

  it("allows owner to mint new tokens", async function () {
    const mintAmount = ethers.parseEther("1000");
    await token.mint(alice.address, mintAmount);
    expect(await token.balanceOf(alice.address)).to.equal(mintAmount);
    expect(await token.totalSupply()).to.equal(TOTAL + mintAmount);
  });

  it("allows holders to burn their tokens", async function () {
    const burnAmount = ethers.parseEther("1000");
    await token.burn(burnAmount);
    expect(await token.totalSupply()).to.equal(TOTAL - burnAmount);
  });

  it("reverts transfer if balance is insufficient", async function () {
    await expect(
      token.connect(alice).transfer(bob.address, ethers.parseEther("1"))
    ).to.be.revertedWith("ShardeumToken: insufficient balance");
  });
});
