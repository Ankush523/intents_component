/* eslint-disable camelcase */
import { ethers } from 'ethers';
import { Presets } from 'userop';

const rpcUrl =
  'https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
const paymasterUrl =
  'https://api.stackup.sh/v1/paymaster/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';

const paymaster = {
  rpcUrl: paymasterUrl,
  context: { type: 'payg' },
};

const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
  paymaster.rpcUrl,
  paymaster.context,
);

export const getSmartAccount = async () => {
  const pvt_key = 'e805da4a6e8970bd7b523b7b245f88a12918c06bbf1ca4d4d6a93cdfdfe50c57'

  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new ethers.Wallet(pvt_key),
    rpcUrl,
    { paymasterMiddleware },
  );

  const address = simpleAccount.getSender();
  console.log('SimpleAccount Address : ', address);
  return simpleAccount;
};
