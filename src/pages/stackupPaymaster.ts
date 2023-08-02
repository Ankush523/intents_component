import { ethers } from 'ethers';
import { Client, Presets } from 'userop';

const rpcUrl = `https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c`;
const paymasterUrl = `https://api.stackup.sh/v1/paymaster/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c`;

const paymaster = {
  rpcUrl: paymasterUrl,
  context: { type: 'payg' },
};

const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
  paymaster.rpcUrl,
  paymaster.context,
);

export const stackupPaymaster = async (
  target: string,
  value: string,
  data: string,
) => {
  const client = await Client.init(rpcUrl);
  // eslint-disable-next-line camelcase
  const pvt_key : any = process.env.PRIVATE_KEY;

  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new ethers.Wallet(pvt_key),
    rpcUrl,
    { paymasterMiddleware },
  );

  const aaTx = await client.sendUserOperation(
    simpleAccount.execute(target, value, data),
    { onBuild: (op) => console.log('Signed UserOperation:', op) },
  );

  // eslint-disable-next-line prefer-destructuring
  const userOpHash = aaTx.userOpHash;
  const ev = await aaTx.wait();
  console.log('UserOperationHash:', userOpHash);
  const txHash: any = ev?.transactionHash;
  console.log('TransactionHash:', txHash);
  return txHash;
};
