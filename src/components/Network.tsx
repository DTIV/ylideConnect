import React from 'react'
import { useEffect, useState } from 'react';
const Network = (props:{eth:any, chainId:string}) => {
    const eth = props.eth
    const chainId = props.chainId
    const [getAddButton, setAddButton] = useState(false)
    const [getError, setError] = useState(false)

    const handleAdd = async () => {
        // Create json with all available chain details for full function
        if(eth){
            try{
                await eth.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: `0x${chainId}`,
                        rpcUrls: ["https://rpc-mainnet.matic.network/"],
                        chainName: "Matic Mainnet",
                        nativeCurrency: {
                            name: "MATIC",
                            symbol: "MATIC",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://polygonscan.com/"]
                    }]
                });
                setError(false)
            }catch(err){
                setError(true)
            }
        }
    }

    const handleSwitch = async () => {
        if(eth){
            try{
                await eth.request({
                    method: "wallet_switchEthereumChain",
                    params: [{
                        chainId: `0x${chainId}`,
                    }]
                });
                setAddButton(false)
            }catch(err){
                console.log(err)
                setAddButton(true)
            }
            
        }
        
    }
    return (
        <div className='card'>
            <div className='med-title'>
                Please Switch Networks!
            </div>
            
            <div>
                {
                    getAddButton ?
                    <div>
                        {
                            getError ?
                            <div>
                                Add Network Manually.
                            </div>
                            : 
                            <button onClick={handleAdd}>
                                Add Network
                            </button>
                        }
                    </div>
                    :
                    <div>
                        <button onClick={handleSwitch} className="uni-button-dark">
                            Switch Network
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Network