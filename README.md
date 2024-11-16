## Deploy Solidity Contracts
1. `cd ./solidity`
2. Set `RPC_URL` and `PRIVATE_KEY` in `.env` file
3. Run `forge script script/Lively.s.sol:DeployLively --rpc-url $RPC_URL --private-key $PRIVATE_KEY --etherscan-api-key $ETHERSCAN_API_KEY --verify --broadcast`
