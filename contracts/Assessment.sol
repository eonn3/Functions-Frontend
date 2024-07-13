// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public lockedAmount;
    uint256 public unlockedAmount;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event AmountLocked (uint256 amount);
    event AmountUnlocked (uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        unlockedAmount = balance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function getLockedAmount() public view returns(uint256){
        return lockedAmount;
    }
    
    function getUnlockedAmount() public view returns(uint256){
        return balance - lockedAmount;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientWBalance(uint256 balance, uint256 withdrawAmount);
    error InsufficientLBalance(uint256 balance, uint256 lockAmount);
    error InsufficientUBalance(uint256 balance, uint256 unlockAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if ((balance - lockedAmount) < _withdrawAmount) {
            revert InsufficientWBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function lock(uint256 _lockAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousLocked = lockedAmount;
        // make sure there is enough balance to lock
        if ((balance - lockedAmount) < _lockAmount) {
            revert InsufficientLBalance({
                balance: balance,
                lockAmount: _lockAmount
            });
        }

        // lock the given amount
        lockedAmount += _lockAmount;

        // update the unlocked amount
        unlockedAmount = balance - lockedAmount;

        // assert that the locked amount is correct
        assert(lockedAmount == _previousLocked + _lockAmount);

        // assert that the unocked amount is correct
        assert(unlockedAmount == balance - lockedAmount);

        // emit the event
        emit AmountLocked(_lockAmount);
    }

    function unlock(uint256 _unlockAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousLocked = lockedAmount;
        // make sure there is enough balance to unlock
        if (lockedAmount < _unlockAmount) {
            revert InsufficientUBalance({
                balance: balance,
                unlockAmount: _unlockAmount
            });
        }

        // unlock the given amount
        lockedAmount -= _unlockAmount;

        // update the unlocked amount
        unlockedAmount = balance - lockedAmount;
        
        // assert that the locked amount is correct
        assert(lockedAmount == _previousLocked - _unlockAmount);

        // assert that the unocked amount is correct
        assert(unlockedAmount == balance - lockedAmount);

        // emit the event
        emit AmountUnlocked(_unlockAmount);
    }
}
