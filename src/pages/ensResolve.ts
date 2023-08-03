import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/LatuiPPNGhXoq-yKXOr75pOLko1WxUxN")

export async function getEnsName(address: string) {
  try {
    const ensName = await provider.lookupAddress(address);
    console.log(ensName);
    return ensName;
  } catch (error) {
    console.log(`Couldn't fetch ENS name: ${error}`);
  }
}