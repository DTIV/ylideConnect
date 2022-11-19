import { EVM_CONTRACTS, EVM_CHAINS } from '@ylide/ethereum';
import { useEffect, useState } from 'react';
import { ethers, Signer, BigNumber,} from 'ethers';
import { REGISTRY_ABI } from '@ylide/ethereum';

const Registry = (props: { provider:ethers.providers.Web3Provider | undefined, connected:boolean, connect:any, currentNetwork:number}) => {
    const [getAccount, setAccounts] = useState<any>("")
    const [getResults, setResults] = useState(false)
    const path = window.location.pathname
    const data = path.split("/").filter((e) => { if(e){ return e != "registry" }}).filter(e=>e)
    const name = data[0]
    const cursor = Number(data[1])
    const contracts = Object(EVM_CONTRACTS)[cursor]
    const registry = contracts.registry.address
    const eth = props.provider
    const connected = props.connected
    const chain = props.currentNetwork
    const regChain = Object(EVM_CHAINS)[cursor]

    const getEtherscanNetwork = () => {
        if(name === "ETHEREUM"){
            return "homestead"
        }else if(name === "POLYGON"){
            return "matic"
        }else if(name === "OPTIMISM"){
            return "optimism"
        }else{
            return ""
        }
    }

    useEffect(() => {
        const getContractData = async () => {
            const network = getEtherscanNetwork()
            let acList
            acList = localStorage.getItem(`${name}-users`)
            if(acList){
                acList = JSON.parse(acList)
            }
            if(connected && eth && network){
                const contract = new ethers.Contract(registry, REGISTRY_ABI.abi, eth)
                if(acList?.length > 0){
                    const ac = await Promise.all(acList.map(async (e:string) => {
                        const k = await contract.addressToPublicKey(e)
                        if(Number(k) != 0){
                            return e
                        }
                    }))
                    setAccounts(ac)
                }else{
                    if(registry && props.provider){
                        const users = new Set()
                        let etherscanProvider = new ethers.providers.EtherscanProvider(network, process.env.REACT_APP_ETHERSCAN_API);
                        const hist = await etherscanProvider.getHistory(registry)
                        hist.map((tx) => {
                            users.add(tx.from)
                        })
                        localStorage.setItem(`${name}-users`, JSON.stringify([...users]))
                        const contract = new ethers.Contract(registry, REGISTRY_ABI.abi, eth)
                        if([...users]?.length > 0){
                            const ac = await Promise.all([...users].map(async (e:any) => {
                                const k = await contract.addressToPublicKey(e)
                                if(Number(k) != 0){
                                    return e
                                }
                            }))
                            setAccounts(ac)
                        }
                    }
                }
            }
        }
    getContractData()
    }, [connected, eth, getResults])

    if(chain === 0){
        return (
            <div className='card'>
                Your Not Connected!
            </div>
        )
    }
    if(regChain != chain){
        return (
            <div className='card'>
                Please Switch Networks!
            </div>
        )
    }

    const handleRefresh = () => {
        localStorage.removeItem(`${name}-users`)
        if(getResults){
            setResults(false)
        }else{
            setResults(true)
        }
    }

    return (
        <div className='card'>
            <div className='med-title'>
                {name} Registrants
            </div>
            <div className='mg2'>
               <strong>Registry Contract:</strong> {registry}
            </div>
            <div>
                {
                    getEtherscanNetwork() ?
                    <button className='uni-button-dark' onClick={handleRefresh}>Refresh</button>
                    : <></>
                }
                
            </div>
            {
                getAccount ?
                <div className='registered-wrap'>
                    {
                        [...getAccount].filter(e=>e).map((e:string, index) => (
                            <div key={index}>
                                {e}
                            </div>
                        ))
                    }
                </div>
                : <div>
                    Loading...
                </div>
            }
        </div>
    )
}

export default Registry