import { useOutletContext } from "react-router-dom";
import AddSongs from "../AddSongs";
import Edit from "../Edit";
import SearchSongs from "../SearchSongs";

export default function AddSongsPage() {
    const context = useOutletContext();
    const playlist = context.playlist;

    return playlist ? <div className="add-songs-container">
        <SearchSongs playlist={playlist}/>
        <Edit playlist={playlist}/>
    </div> : <h1>Make a new playlist or update an existing one from the "My mixes" page.</h1>
}