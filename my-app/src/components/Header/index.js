import { Link } from "react-router-dom"

export default function Header(){
    return <div className="header-container"> 
            <Link to={`/`}>Home</Link>
            <Link to={`playlists`}>My mixes</Link>
            <Link to={`make-playlist`}>New mix</Link>
            <div>About</div>
    </div>
}