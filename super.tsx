import { Framework } from '@superfluid-finance/sdk-core';
import { useState } from 'react'
import { useSigner } from 'wagmi'

const [flowStart, setFlowStart] = useState(false)
const { data: signer } = useSigner()

async function createNewFlow(recipient: any, flowRate: any) {

    if (signer) {

      const sf = await Framework.create({
        chainId: 5,
        provider: signer?.provider
      });
    
      const DAIxContract = await sf.loadSuperToken("fDAIx");
      const DAIx = DAIxContract.address;
    
      try {
        const createFlowOperation = sf.cfaV1.createFlow({
          flowRate: flowRate,
          receiver: recipient,
          superToken: DAIx,
          sender: await signer.getAddress()
          // userData?: string
        });
    
        console.log("Creating your stream...");

        console.log(signer)
    
        const result = await createFlowOperation.exec(signer);
        console.log(result);

        setFlowStart(true)
    
        console.log(
          `
          Congrats - you've just created a money stream!
          View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
          Network: Goerli
          Super Token: DAIx
          Sender: ${await signer.getAddress()}
          Receiver: ${recipient},
          FlowRate: ${flowRate}
        `
        );
      } catch (error) {
        setFlowStart(false)
        console.log(
          "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
      }

    }
    else {
      console.log("Connect wallet")
    }

  }

async function deleteFlow(receiver: any) {
    
  if (signer) {

    const sf = await Framework.create({
      chainId: 5,
      provider: signer?.provider
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address
    
    try {
      
      const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
        sender: await signer.getAddress(),
        receiver: receiver,
        superToken: DAIx
        // userData?: string
      });
  
      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(signer);
      console.log(result);

      setFlowStart(false)
  
      console.log(
        `Congrats - you've just deleted your money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/${receiver}
        Network: Goerli
        Super Token: DAIx
        Sender: ${await signer.getAddress()},
        Receiver: ${receiver},
      `
      );
  
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }

  }
  else {
    console.log("Connect wallet")
  }

}