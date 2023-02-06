// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.17;

contract TicketSystem
{
    //address which deployed the contract
    address payable public owner;

    //number of Tickets
    uint256 public totalTicketsAvailable = 3;

    //keep list of ticket buyers
    mapping(uint256 => address) public ticketBuyers;
    uint256 counter = 0;

    //ticket price
    uint256  public ticketPrice = 0.0001 ether;


    constructor()
    {
        owner = payable (msg.sender);
    }

    //access control to restrict the access to owner
    modifier onlyOwner
    {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function purchaseTicket() external payable  
    {
        if(totalTicketsAvailable <= 0)
        {
            //error handling - if tickets are available
            revert("Tickets Unavailable");
        }

        //if amount send is greater than ticket-price
        require(msg.value >= ticketPrice, "Not sufficient Ether");
  
        totalTicketsAvailable -=1;
        ticketBuyers[counter] = msg.sender;
        counter++;
   
    }

    function getBuyersList() public view returns(address[] memory)
    {
        address[] memory buffer = new address[](counter);
        for(uint256 i; i< counter; i++)
            buffer[i] = ticketBuyers[i];
        return buffer;
    }

    //withdraw the amount from contract to owner
    function withdraw() public onlyOwner
    {
        uint total = address(this).balance;

        //transfer allowed if total is more than zero
        assert(total > 0);

        (bool success,) = owner.call{value: total}("");
        require(success, "Failed to send ether");
    }

    //the contract can receive amount
    receive() external payable {}
}