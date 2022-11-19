
import { evmFactories, ethereumWalletFactory, EVMNetwork, EthereumListSource, EVM_CHAINS, EVM_NAMES, EVM_CONTRACTS, EVM_CHAIN_ID_TO_NETWORK} from '@ylide/ethereum';
import { Ylide, BrowserLocalStorage, YlideKeyStore, BlockchainControllerFactory} from "@ylide/sdk"
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import Chains from './components/Chains';
import Header from './components/Header';
import { Routes, Route, Link } from "react-router-dom";
import { detectProvider, getCurrentChainName } from './utils/Utils';
import axios from "axios"

import TokenSearch from './components/TokenSearch';
import Registry from './components/Registry';

declare let window : any;

function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [getYlide, setYlide] = useState<any>("");
  const [getCurrentAccount, setCurrentAccount] = useState("");
  const [getCurrentNetwork, setCurrentNetwork] = useState<number>(0);
  const [getProvider, setProvider] = useState<any>(false);
  const [getMMProvider, setMMProvider] = useState<ethers.providers.Web3Provider>();
  const [getEtherBal, setEtherBal] = useState<any>("");

  useEffect(()=> {
    const provider = detectProvider()
    setProvider(provider)
    if(provider){
      provider.request({ method: 'eth_accounts' })
      .then((res:any) => {
        if(res.length > 0){
          setConnected(true)
          onConnect(provider)
        }
      })
    }
  },[getCurrentAccount, getProvider])

  useEffect(() => { 
    // Handle account and network changes
    const handleAccountsChanged = async () => {
      const accounts = await getProvider.request({method: 'eth_accounts'})
      setCurrentAccount(accounts)
    }

    const handleNetworkChanged = async () => {
      const chainId = await getProvider.request({ method: 'eth_chainId' });
      setCurrentNetwork(parseInt(chainId))
    }

    if(connected){
      getProvider.on('accountsChanged', handleAccountsChanged);
      getProvider.on('chainChanged', handleNetworkChanged);
      return () => {
        getProvider.removeListener('accountsChanged', handleAccountsChanged);
        getProvider.removeListener('chainChanged', handleNetworkChanged);
      }
    }
  }, [connected, getProvider])


  const Connect = async () => {
    // METAMASK CONNECT
    if(getProvider) {
      if(getProvider !== window.ethereum) {
        console.error("Not window.ethereum provider!")
      }
      setConnecting(true);
      try{
        await getProvider.request({
          method: "eth_requestAccounts"
        })
      }catch(err: any){
        console.log(err);
      }
      onConnect(getProvider)
      setConnecting(false);
    }
  }

  const onConnect = async (provider:any) => {
    // ETHERS.JS CONNECT
    const chain_id = await provider.request({ method: 'eth_chainId' })
    const eth = new ethers.providers.Web3Provider(provider);
    // console.log(eth)
    const accounts = await eth.listAccounts()
    setMMProvider(eth)
    try{
      const weiBalance = (await eth.getBalance(accounts[0])).toString()
      const etherBalance = (Number(weiBalance)/10**18).toFixed(5)
      provider.request({ method: 'eth_accounts' })
      .then((res:any) => {
        if(res.length > 0){
          setConnected(true)
          setCurrentAccount(accounts[0])
          setCurrentNetwork(parseInt(chain_id))
          setEtherBal(etherBalance)
        }else{
          setConnected(false)
        }
      })
    }catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <div id="App-inner"  className="app-wrap" >
        <Header 
          connected={connected}
          account={getCurrentAccount}
          currentNetwork={getCurrentNetwork}
          balance={getEtherBal}
          connect={Connect} 
          width={1000}/>
        <div id="cover" className="cover hide"></div>
        <div id="main-wrap" className="main-wrap">
        <Routes>
          <Route path="/" element={<Chains />}/>
          <Route path="/search/:name/:id" element={<TokenSearch
          provider={getProvider}
          mmProvider={getMMProvider} 
          connected={connected} 
          connect={Connect}
          currentNetwork={getCurrentNetwork}
          />}/>
          <Route path="/registry/:name/:id" element={<Registry
          provider={getMMProvider} 
          connected={connected} 
          connect={Connect}
          currentNetwork={getCurrentNetwork}
          />}/>
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
