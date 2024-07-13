import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [lockedAmount, setLockedAmount] = useState(0);
  const [unlockedAmount, setUnlockedAmount] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const handleLock = async (e) => {
    e.preventDefault();
    if (lockedAmount <= balance) {
      await lock(1);
    } else {
      console.log("Amount exceeds available balance.")
    }
  }

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (unlockedAmount <= (balance - lockedAmount)) {
      await unlock(1);
    } else {
      console.log("Amount exceeds available balance.")
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const getLockedAmount = async() => {
    if (atm) {
      setLockedAmount((await atm.getLockedAmount()).toNumber());
    }
  }

  const getUnlockedAmount = async() => {
    if (atm) {
      setUnlockedAmount((await atm.getUnlockedAmount()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
      getLockedAmount();
      getUnlockedAmount();
    }
  }

  const withdraw = async() => {
    if (atm && (balance - lockedAmount) >= 1) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
      getLockedAmount();
      getUnlockedAmount();
    }
    else {
      console.log("No withdrawable balance.");
      alert("No withdrawable balance.");
    }
  }

  const lock = async() => {
    if (atm && (balance - lockedAmount) >= 1) {
      let tx = await atm.lock(1);
      await tx.wait()
      getLockedAmount();
      getUnlockedAmount();
    }
    else {
      console.log("No lockable balance.");
      alert("No lockable balance.");
    }
  }

  const unlock = async() => {
    if (atm && lockedAmount >= 1) {
      let tx = await atm.unlock(1);
      await tx.wait()
      getLockedAmount();
      getUnlockedAmount();
    }
    else {
      console.log("No unlockable balance.");
      alert("No unlockable balance.");
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    if (unlockedAmount == undefined) {
      getUnlockedAmount();
    }

    return (
      <div>
        <h3>Account Address</h3>
        <p>{account}</p>
        <h3>Account Balance</h3>
        <p>Total: {balance} ETH</p>
        <p>Locked: {lockedAmount} ETH</p>
        <p>Unlocked: {unlockedAmount} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={handleLock}>Lock 1 ETH</button>
        <button onClick={handleUnlock}>Unlock 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM (E's version)!</h1></header>
      {initUser()} 
      <style jsx global>{`
        body {
          background-color: #36393B;
          font-family: 'Inter', sans-serif;
          color: #F0EAD6;
        }
        .container {
          text-align: center;
        }
        header {
          color: #A5D8FF;
          letter-spacing: 1px;
          font-size: 24px;
          padding-top: 50px;
          padding-bottom: 15px;
        }
        h3 {
          font-size: 24px;
          color: #BFB6BB;
        }
        p {
          font-size: 18px;
        }
        button {
          background-color: #A5D8FF;
          font-family: 'Inter', sans-serif;
          color: #36393B;
          border: 1px solid #A5D8FF;
          padding: 10px 20px;
          margin: 10px;
          cursor: pointer;
          border-radius: 5px;
          font-size: 16px;
        }
        button:hover {
          background-color: #C49799;
          border: 1px solid #C49799;
        }
      `}
      </style>
    </main>
  )
}
