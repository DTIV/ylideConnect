import { EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';

declare let window : any;


export const detectProvider = () => {
    // Get provider
    let provider;
    if(window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    }else{
      window.alert("No Ethereum browser detected")
    }
    return provider
}

export const getCurrentChainIndex = (currentNetwork:number) => {
  const chains = EVM_CHAINS
  if(currentNetwork){
    const currChainIndex = Object.keys(chains).filter((key) => {
      return Object(chains)[key] === currentNetwork
    })
    return currChainIndex[0]
  }
}

export const getCurrentChainName = (currentNetwork:number) => {
  if(currentNetwork){
    const currChainIndex = getCurrentChainIndex(currentNetwork)
    if(currChainIndex){
      return( Object(EVM_NAMES)[currChainIndex] )
    }
  }
}
