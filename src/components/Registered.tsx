import { EVM_CONTRACTS, EVM_CHAINS } from '@ylide/ethereum';
import { useEffect, useState } from 'react';
import { ethers, Signer, BigNumber,} from 'ethers';


const Registered = (props:{registry:string[] | undefined}) => {
    const registered = props.registry
    if(registered?.length){
        return (
            <div className='card'>
                Token Holders!
                {
                    registered.map((e) => (
                        <div>
                            {e}
                        </div>
                    ))
                }
            </div>
        )
    }
    return (
        <div className='card'>
            No Registered Token Holders
        </div>
    )
}

export default Registered