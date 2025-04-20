//balance View
web3.eth.getBalance("0xb55B7A52d99aE02d7Ba8dE8170237fA2FB669775").then(function(rvalue){
    rvalue=web3.utils.fromWei(rvalue,"ether");
   $("#balance").html(rvalue + "ETH"); 

})