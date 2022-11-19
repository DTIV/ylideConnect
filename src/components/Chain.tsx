import React from 'react'
import { EVM_NAMES } from '@ylide/ethereum';
import axios from 'axios'
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
const Chain = (props:any) => {
    const [chainImage, setChainImage] = useState("")
    let chainName = Object(EVM_NAMES)[props.cursor]

    useEffect(() => {
        const fetchData = async () => {
            const cn = localStorage.getItem(`${chainName}`)
            if(!cn){
                if(chainName === "BNBCHAIN"){chainName = "BNB"}
                const data = await axios.get(`https://api.coingecko.com/api/v3/search?query=${chainName}`)
                const coins = data.data.coins[0]
                console.log("calling API")
                if(coins){
                    if(coins.large){
                        setChainImage(coins.large)
                        if(chainName === "BNB"){chainName = "BNBCHAIN"}
                        localStorage.setItem(`${chainName}`, JSON.stringify(coins.large))
                    }
                }
            }else{
                setChainImage(JSON.parse(cn))
            }
        }
        fetchData()
       
    }, [chainName])
    
    return (
        <div className='chain-card'>
            <Link to={`/search/${chainName}/${props.cursor}`}>
                {
                    chainImage ?
                    <div>
                        <img src={chainImage} alt="" />
                    </div>
                    : <div>
                        { chainName }
                    </div>
                }
            </Link>
        </div>
    )
}

export default Chain