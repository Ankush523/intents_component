import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

type Props = {
  intentMsg: string;
  scwAddress: string;
};

const IntentComponent: React.FC<Props> = ({ intentMsg, scwAddress }) => {
  const [txObject, setTxObject] = useState<any | null>(null);

  useEffect(() => {
    const fetchIntent = async () => {
      // initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // get chainId
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          recipient: scwAddress,
          command: intentMsg,
          chainId: chainId,
        }),
      };

      const response = await fetch(
        `https://intents-api.onrender.com/intents`,
        options,
      );

      const data = await response.json();
      console.log(data.info.txObject);
      setTxObject(data.info.txObject);
    };

    if (window.ethereum) {
      fetchIntent();
    } else {
      console.log("Please install MetaMask!");
    }
  }, [scwAddress, intentMsg]);

  return (
    <div>
        <h1 className='text-xl mb-[30px]'>Intent Txn Object is : </h1>
      <p>
        to: {txObject?.to} <br />
        value: {txObject?.value} <br />
        data: {txObject?.data}
      </p>
    </div>
  );
  
}

export default IntentComponent;
