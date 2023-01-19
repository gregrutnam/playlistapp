import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function MakePlaylist() {
    const context = useOutletContext();

    const spotifyToken = context[0].spotifyToken

return spotifyToken ? <div>
        <h1>Make a playlist</h1>
        <p>Name</p>
        <input onBlur={context[5].playlistName}></input>
        <p>Description</p>
        <input onBlur={context[6].playlistDescription}></input>
        <p>Select a setting</p>
        <select onChange={context[7].playlistSetting}>
        <option>Public</option>
        <option>Private</option>
        </select>
        <button onClick={context[8].makePlaylist}><Link to="../add-songs">Make playlist</Link></button>
    </div> : <h1>You are no longer signed in</h1>;
}
