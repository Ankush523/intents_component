import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getSmartAccount } from './getSmartAccount';
import { stackupPaymaster } from './stackupPaymaster';
import { getEnsName } from './ensResolve';
import { Box, Button, Container, Heading, Input, Spinner, VStack, useToast,Text, Center } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import animationData from './animation_load.json'; // import your lottie animation data

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IntentComponentProps {
  width?: string;
  height?: string;
}

const IntentComponent: React.FC<IntentComponentProps> = ({width = "400px", height = "50px"}) => {
  const [intentMsg, setIntentMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [isEnsAvailable, setIsEnsAvailable] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let account = await signer.getAddress();
        const ensName = await getEnsName(account);
        if(ensName){
          account = ensName;
          setIsEnsAvailable(true)
        } 
        setAccount(account);
      }
    };

    fetchAccount();
  }, []);

  
  const fetchIntent = async () => {

    setIsLoading(true);

    const simpleAcc = await getSmartAccount();
    const scwAddress = simpleAcc.getSender();
    setAccount(scwAddress);

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
    
    // Automatically send transaction after fetching intent
    if (data.info.txObject) {
      sendTransactionWithPaymaster(data.info.txObject.to, data.info.txObject.value);
    }
  };
  
  const sendTransactionWithPaymaster = async (to: string, value: string) => {
    try {
      const txHash = await stackupPaymaster(to, value, '0x');
      console.log("Transaction hash: ", txHash);
      setTxnHash(txHash);
    } catch (err) {
      console.error("Error sending transaction: ", err);
    } finally {
      setIsLoading(false); // move this here to keep loading until the transaction completes
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.ethereum) {
      fetchIntent();
    } else {
      console.log("Please install MetaMask!");
    }
  }

  const displayAccount = account 
    ? isEnsAvailable 
      ? account 
      : `${account.substring(0, 5)}...${account.substring(account.length - 5)}`
    : null;

  return (
    <Container maxW="xl" centerContent bg="green.50" borderRadius={10} py={10}>
      <VStack spacing={6}>
      <Box 
        bg="green.700" 
        color="white" 
        borderRadius="lg" 
        px={4} 
        py={2}
        fontFamily={'Raleway'}
      >
        {displayAccount ? `Connected : ${displayAccount}` : 'No Account Connected'}
      </Box>
        {/* <Heading color="green.700">Enter Intent and Submit:</Heading> */}
        <Center w="100%">
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
              <Input
                bg="white"
                borderColor="green.500"
                color="green.900"
                _placeholder={{ color: 'green.400' }}
                focusBorderColor="green.300"
                style={{width: width, height: height}}
                type="text"
                value={intentMsg}
                onChange={(e) => setIntentMsg(e.target.value)}
                fontFamily={'Space Mono'}
                placeholder="Enter your intent here"
              />
              <br/>
              <Button fontFamily={'Raleway'} type="submit" colorScheme="green" marginBottom="4" width="350px" size="md">Execute</Button>
            </Box>
          </form>
        </Center>
        {isLoading ? (
          <Box>
            <Lottie animationData={animationData} style={{width: "150px", height: "150px"}}/> 
            {/* <Text color="green.500"  fontSize="lg">Executing...</Text> */}
          </Box>
        ) : txnHash && 
        <Box
            color="green.800"
            fontSize="lg"
            bg="green.200"
            borderRadius="md"
            px={5} // Increase horizontal padding
            py={2} // Increase vertical padding
            wordBreak="break-all" // Break words to prevent overflow
            onClick={() => window.open(`https://goerli.etherscan.io/tx/${txnHash}`, "_blank")} // Replace this with the correct block explorer URL
            cursor="pointer" // Change cursor to pointer on hover to indicate clickability
        >
            Your transaction is completed. Click here to view.
        </Box>
        }
        <Text 
        fontFamily={'Space mono'} 
        color="green.700" fontSize="lg"
        onClick={() => window.open(`https://intents-bytekode.vercel.app/`, "_blank")}
        >
          by ©️bytekode labs,inc
        </Text>
      </VStack>
    </Container>
  );
}

export default IntentComponent;