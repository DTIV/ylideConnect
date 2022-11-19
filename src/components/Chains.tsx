import React from 'react'
import axios from 'axios'
import { EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';
import Chain from './Chain';
import "../css/chains.css"

const Chains = () => {
    return (
        <div className='chains-wrap'>
            {
                Object.keys(EVM_NAMES).filter((e) => {return Object(EVM_NAMES)[e] != "LOCAL_HARDHAT" && Object(EVM_NAMES)[e] != "ARBITRUM"}).map((e) => (
                    <div key={e}>
                        <Chain 
                            cursor={e}/>
                    </div>
                ))
            }
        </div>
    )
}

export default Chains