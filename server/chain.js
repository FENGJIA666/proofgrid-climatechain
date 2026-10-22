import ganache from 'ganache';
import { BrowserProvider, ContractFactory, Contract } from 'ethers';
import solc from 'solc';
import { readFile } from 'node:fs/promises';
export async function createChain() {
  const source=await readFile(new URL('../contracts/EnergyRegistry.sol',import.meta.url),'utf8');
  const output=JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources:{'EnergyRegistry.sol':{content:source}},settings:{evmVersion:'shanghai',outputSelection:{'*':{'*':['abi','evm.bytecode']}}}})));
  const errors=output.errors?.filter(e=>e.severity==='error'); if(errors?.length) throw new Error(errors.map(e=>e.formattedMessage).join('\n'));
  const artifact=output.contracts['EnergyRegistry.sol'].EnergyRegistry;
  const rpc=ganache.provider({logging:{quiet:true},chain:{chainId:1337},wallet:{totalAccounts:2},miner:{instamine:'eager'}});
  const provider=new BrowserProvider(rpc),signer=await provider.getSigner();
  const contract=await new ContractFactory(artifact.abi,artifact.evm.bytecode.object,signer).deploy(); await contract.waitForDeployment();
  return {rpc,provider,signer,contract,abi:artifact.abi,address:await contract.getAddress(),other:async()=>new Contract(await contract.getAddress(),artifact.abi,await provider.getSigner(1))};
}
