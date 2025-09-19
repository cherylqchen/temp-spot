import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

export default function Header() {
    return (
        <header>
            <Link to="/">
                <img src={logo}/>
            </Link>
            <Link to="/" style={{textDecoration: "none"}}><span className="title">spotify roulette</span></Link>
        </header>
    )
}