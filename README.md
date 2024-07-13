# Smart Contract Management Functions

This is a Solidity project with a smart contract simulating a version of an ATM. Its functions are ``deposit(amount)``, ``withdraw(amount)``, ``lock(amount)``and ``unlock(amount)``.

## Description

``Assessment.sol`` has a contract called ``Assessment``, representing the ATM. It has the variables: ```owner```, ```balance```, ```lockedAmount```,and ```unlockedAmount``` which represent account owner, the account balance, the locked amount, and the locked amount. Its three functions are ``deposit()``, ``withdraw()``, ``lock()`` which locks a certain amount from the balance, and ``unlock(amount)`` which unlocks it.

## Getting Started

### Deploying the Project

1. In the terminal, install the dependencies with ```npm i```.
2. Open two other terminals.
3. In one terminal, run ```npm hardhat node```.
4. In another terminal, run ```

### Landing Page

Going to localhost:3000 shows the landing page, welcoming the user to the ATM site. Click the button to connect to the Metamask wallet.

### Account and Balance Information

Once the wallet is connected, the page now shows the Account Address and a breakdown of the Account Balance (Total, Unlocked, and Locked).

### Deposit 1 ETH

Clicking the **Deposit 1 ETH** button leads to a Metamask transaction confirmation. Once confirmed, and the transaction lands, the total balance and unlocked balance both increment by 1.

### Withdraw 1 ETH

Clicking the **Withdraw 1 ETH** button leads to a Metamask transaction confirmation. Once confirmed, and the transaction lands, the total balance and unlocked balance both decrement by 1. Attempting to withdraw when there is no available balance shows an alert message and does not allow the transaction to push through.

### Lock 1 ETH

Clicking the **Lock 1 ETH** button leads to a Metamask transaction confirmation. Once confirmed, and the transaction lands, the locked balance increments by 1 and the unlocked balance decrements by 1. Attempting to lock when there is no available balance shows an alert message and does not allow the transaction to push through.

### Unlock 1 ETH

Clicking the **Unlock 1 ETH** button leads to a Metamask transaction confirmation. Once confirmed, and the transaction lands, the unlocked balance increments by 1 and the locked balance decrements by 1. Attempting to unlock when there is no available balance shows an alert message and does not allow the transaction to push through.


## Author

Eonn Domingo


## License

This project is licensed under the MIT License - see the LICENSE file for details.
