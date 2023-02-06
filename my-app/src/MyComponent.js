import {useEffect, useState, useRef } from "react";

import Web3Modal from 'web3modal';
import {Contract, ethers, providers } from "ethers";
import {NFT_CONTRACT_ADDRESS, abi} from "./constant";

import {Element} from "./Element.js";


export function MyComponent()
{
    const [walletConnected,setWalletConnected] = useState(false);
    const [ticketCount, setTicketCount] = useState();
    const [currentCount, setCurrentCount] = useState();

    const [ticketBuyers, setTicketBuyers] = useState([]);
    const web3ModalRef = useRef();


    useEffect(()=>{
        web3ModalRef.current = new Web3Modal({
            network:'goerli',
            providerOptions:{}
        });

        if(web3ModalRef.current.providerController.injectedProvider == null)
        {
            alert("Get Walllet");
        }
        
    },[])

/*
    useEffect(() => {
        if (currentCount !== undefined) {
          setTicketCount(currentCount);
        }
      }, [currentCount, ticketCount]);
      */

    //connect wallet
    async  function connectWallet() 
    {
        try{

            const providerSigner = await getProviderOrSigner();
            console.log(providerSigner);
            setWalletConnected(true);

            await setTicketCounter();
            await displayBuyers();
        }
        catch(error)
        {
            console.log(error);
        }
    }


    async function getProviderOrSigner(getSigner = false)
    {
        try
        {
            const provider = await web3ModalRef.current.connect();
            const web3Provider = new providers.Web3Provider(provider);

            const {chainId} = await web3Provider.getNetwork();

            if(chainId !== 5)
            {
                alert("Connect to Goerli Network");
            }

            if(getSigner)
            {
                const signer = web3Provider.getSigner();
                return signer;
            }

            return provider;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    //purchase Ticket
    const purchaseTicket = async () =>
    {
        try
        {
            const signer = await getProviderOrSigner(true);
            const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);
            //const account = await signer.getAddress();
            const ticket = await contract.purchaseTicket({ value: ethers.utils.parseEther("0.0001") });
            const txHash = ticket.hash;
            console.log(`Transaction hash: ${txHash}`);
        
            const receipt = await signer.provider.waitForTransaction(txHash);
            console.log(`Transaction status: ${receipt.status ? "Success" : "Failure"}`);
            if(receipt.status == 1)
            {
                setTicketCounter();
                displayBuyers();
            }

        }
        catch(error)
        {
            console.log(error);
        }
    }


    async function setTicketCounter()
    {
        try
        {
            const signer = await getProviderOrSigner(true);
            const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);

            var count = await contract.totalTicketsAvailable();
            //console.log(count.toString());
            setTicketCount(count.toString());
        }
        catch(error)
        {
            console.log(error);
        }
    }


    const displayBuyers = async () =>
    {
        try
        {
            //to call functions
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

            const buyers = await contract.getBuyersList();
            
            setTicketBuyers(buyers);

        }
        catch(error)
        {
            console.log(error);
        }
    }

    const transferAmountToOwner = async () =>
    {
        try
        {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

            const buyers = await contract.withdraw();
            
        }
        catch(error)
        {
            console.log(error);
        }
    }

    return (<div className="buttonbox">

        <button id= "buttons" onClick={connectWallet}> Connect Wallet</button>
        <button id= "buttons" onClick={purchaseTicket}> Purchase Ticket</button>
        <button id= "buttons" onClick={displayBuyers}> Display Buyers</button>
        <button id= "buttons" onClick={transferAmountToOwner}> Transfer To Owner</button>
        
        <br></br>
        <label> Ticket Remaining: {ticketCount} </label>
        {console.log({ticketCount})}
        <label> Ticket Buyers: {ticketBuyers.length} </label>

        { ticketBuyers.length>0 ?  <Element  buyer={ticketBuyers} /> : null  }
        
    </div>);
}