import { useOutletContext } from "react-router-dom";
import AddSongs from "../AddSongs";
import Track from "../Track";

export default function SearchSongs({playlist}){

    const context = useOutletContext();
    const results = context.results;

    return <div className="add-songs-search">
    <h2>Add some songs</h2>
    <input 
        onChange={context.handleQuery} 
        placeholder="Search for songs">
    </input>
    <button 
        onClick={context.searchTracks}>Search
    </button>
    <div className="add-songs-results">
        {results.length > 0 ? 
            results.map(result =>
                <AddSongs track={result} playlist={playlist}/>
            ) : null}
    </div>
</div>
}