
import { EVM_CHAINS } from '@ylide/ethereum';
import { Ylide } from "@ylide/sdk"
import { useEffect, useState } from 'react';
import Network from './Network';
import axios, { AxiosResponse } from 'axios';
import Registered from './Registered';
import { ethers } from 'ethers';
import { ERC20_ABI } from '../contractData/ERC20';
import { Link } from 'react-router-dom';

const TokenSearch = (props: {provider:any, mmProvider:any | undefined, connected:boolean, connect:any, currentNetwork:number}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [getAddress, setAddress] = useState("")
    const [onPage, setOnPage] = useState(0)
    const [getHoldersChecked, setHoldersChecked] = useState(0)
    const [getToggleStop, setToggleStop] = useState(false)
    const [getStop, setStop] = useState(false)
    const [getRegistered, setRegistered] = useState<string[]>([])
    const [getPageNo, setPageNo] = useState(0)
    const [getTokenData, setTokenData] = useState<string>()
    const path = window.location.pathname
    const data = path.split("/").filter((e) => { if(e){ return e != "search" }}).filter(e=>e)
    const name = data[0]
    const cursor = Number(data[1])
    const provider = props.provider
    const eth = props.mmProvider
    const connected = props.connected
    const chain = props.currentNetwork
    const chains = Object(EVM_CHAINS)
    const regChain = chains[cursor]
    const chainId = Number(regChain).toString(16)
    let pageSize = 100
    let pageNo = 1
    let registered: string[] = []

    useEffect(() => {
        if(!getStop){
            if(getPageNo > 0){
                setIsLoading(true)
                setToggleStop(true)
                const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));
                const checkRoom = async () => { // async func
                    const data  = await checkHolders(getPageNo, pageSize, registered)
                    registered = data.registered
                    if(pageNo == 0) {
                        setToggleStop(false)
                        setIsLoading(false)
                        return
                    } else {
                        await delay(10000)
                        let pageNo = getPageNo + 1
                        const data = await checkHolders(pageNo, pageSize, registered)
                        console.log(data)
                        registered = data.registered
                        if(data.pagination){
                            let hasMore = data.pagination.has_more
                            if(!hasMore){
                                setPageNo(0)
                                return
                            }
                        }
                        
                        setPageNo(pageNo)
                    }
                }
                checkRoom()
            }
        }
    }, [getPageNo, getStop])
    

    if(chain === 0){
        return (
            <div>
                Your Not Connected!
            </div>
        )
    }

    if(regChain != chain){
        return ( <Network eth={provider} chainId={chainId}/> )
    }

    const checkHolders = async (pageNo:number, pageSize:number, registered: string[]) => {
        let pagination
        try{
            const url = `https://api.covalenthq.com/v1/${chainId}/tokens/${getAddress}/token_holders/?page-number=2&page-size=${pageSize}&key=${process.env.REACT_APP_COVALENT_API}`
            console.log(url)
            const res = await axios.get(`https://api.covalenthq.com/v1/${chainId}/tokens/${getAddress}/token_holders/?page-number=2&page-size=${pageSize}&key=${process.env.REACT_APP_COVALENT_API}`)
            pagination = res.data.data.pagination
            const data = res.data.data
            const holders = data.items
            setOnPage(pageNo)
            await holders.map(async (e:any) => {
                let res = Ylide.isWalletRegistered(name, e.address)
                if(res){
                    getRegistered.push(e.address)
                }
            })
            // setRegistered(registered)
            setHoldersChecked(getHoldersChecked + pageSize)
        }catch(err){
            console.log(`page ${pageNo} Error`)
        }
        return {registered, pagination }
    }


    const mainFunction = async () => {
        const contract = new ethers.Contract(getAddress, ERC20_ABI.abi, eth)
        const sym = await contract.symbol()
        const data = await axios.get(`https://api.coingecko.com/api/v3/search?query=${sym}`)
        console.log(data.data.coins[0])
        setTokenData(JSON.stringify(data.data.coins[0]))
        setPageNo(1)
    }

    const handleStop = () => {
        console.log("stopping!")
        pageNo = 0
        setPageNo(0)
        setToggleStop(false)
        setIsLoading(false)
        setStop(true)
    }

    return (
        <div>
            <div>
                <Link to={`/registry/${name}/${cursor}`}>View All Registered Accounts</Link>
                
            </div>
            <div className='card'>
                {
                    !connected ?
                    <div>
                        <button onClick={props.connect}>
                            Your Not Connected!
                        </button>
                    </div>
                    :
                    <div>
                        <div className='token-card'>
                            <div className='med-title'>
                                Registered Token Holders
                            </div>
                            <div className='gap2 grid-wrap'>
                                <input type="text"  className='uni-input' placeholder={`Enter ${name} Address`} onChange={(e)=>setAddress(e.target.value)}/>
                                {
                                    getToggleStop ?
                                    <input type="submit" value={"Stop"} className="uni-button-dark" onClick={handleStop}/>
                                    :
                                    <input type="submit" value={"Generate"} className="uni-button-dark" onClick={(e) => {mainFunction()}}/>
                                    
                                }       
                            </div>
                            <div className='info-wrap'>   
                                <div className='contract-data'>
                                    <div>
                                        {
                                            getTokenData ?
                                            <div>
                                                <div>
                                                    <img className='contract-img' src={JSON.parse(getTokenData).large} alt="" />
                                                </div>
                                                <div><strong>{JSON.parse(getTokenData).name}</strong>  {`( ${JSON.parse(getTokenData).symbol} )`}</div>
                                            </div>
                                            :<></>
                                        }
                                    </div>
                                    <div>
                                        <div>
                                            Holders Checked: {getHoldersChecked}
                                        </div>
                                        <div>
                                            Page: {onPage}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            isLoading ?
                            <div>
                                Loading...
                            </div>
                            :<></>
                        }
                    </div>
                }
            </div>
            <Registered 
                registry = {getRegistered}/>
        </div>
        
    )
}

export default TokenSearch