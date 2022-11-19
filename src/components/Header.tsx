import "../css/header.css"
import uni from "../img/uni.svg"

const Header = (props:any) => {
    return (
        <nav className="navbar">
            <div className="top-bar">
                <div className="logo-wrap">
                    <strong>ylide</strong>Connect
                </div>
                <div>
                    <div>
                        <a href="">Docs</a>
                    </div>
                </div>
                <div className="full-menu-wrap">
                    <div className="full-selection">
                        <div className="wallet-wrap">
                            
                            {
                                props.connected ?
                                <div>
                                    {props.account.slice(0,2)+"..."+props.account.slice(38,43)}
                                </div>
                                :
                                <div>
                                    <button onClick={props.connect}>Connect</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header