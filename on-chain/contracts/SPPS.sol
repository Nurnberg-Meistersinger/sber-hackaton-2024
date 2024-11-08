pragma solidity 0.8.19;

contract SPPS {
    
    struct Proof {
        uint[2]  pi_a;
        uint[2][2]  pi_b;
        uint[2]  pi_c;
    }
    
    struct Signal {
        uint blockNumber;
        uint assetPrice;
        string hash;
    }
    
    struct PeriodProof {
        uint yield;
        Proof proof;
        uint blockNumber;
        uint assetPrice;
        string newBalanceHash; // TODO add period
    }
    
    address[] public traders;
    mapping(address => Signal[]) public signals;
    mapping(address => PeriodProof[]) public periodProofs;
    mapping(address => string) public metaData; // email
    
    
    function newTrader(string calldata _metaData) external {
        traders.push(msg.sender);
        metaData[msg.sender] = _metaData;
    }
    
    function addSignal(string calldata newSinal, uint256 assetPrice) external {
        Signal memory sig = Signal(block.number, assetPrice, newSinal);
        signals[msg.sender].push(sig);
    }
    
    function addPeriodProof(
        uint256 yield, 
        Proof calldata proof, 
        string calldata balanceHash, 
        uint256 blockNumber, 
        uint256 assetPrice
    ) external {
        PeriodProof memory pr = PeriodProof(yield, proof, blockNumber, assetPrice, balanceHash);
        periodProofs[msg.sender].push(pr);
    }
    
    function getTradeLen(address trader) external view returns(uint) {
        return signals[trader].length;
    }
    
    function getProofLen(address trader) external view returns(uint) {
        return periodProofs[trader].length;
    }
    
    function getTradersCount() external view returns(uint) {
        return traders.length;
    }

    function getSignal(address trader, uint256 index) external view returns(Signal memory) {
        return signals[trader][index];
    }

    function getPeriodProof(address trader, uint256 index) external view returns(PeriodProof memory) {
        return periodProofs[trader][index];
    }

    // for demo
    function changeTradeTime(address trader, uint tradeId, uint tradeBlock) external {
        signals[trader][tradeId].blockNumber = tradeBlock;
    }
}