import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function AddSongs() {
    const context = useOutletContext();
    const spotifyToken = context[0].spotifyToken
    const results = context[3].results;
    const playlist = context[1].playlist;

    useEffect(() => { console.log("this is the playlist in addsongs", playlist) }, [playlist])
    console.log("results", results)

    return spotifyToken ? <div className="add-songs-container">
        <div className="add-songs-search">
            <h1>Add some songs</h1>
            <input 
                onChange={context[13].handleQuery} 
                placeholder="Search for songs">
            </input>
            <button 
                onClick={context[11].searchTracks}>Search
            </button>
            <div className="add-songs-results">
                {results.length > 0 ? 
                    results.map(
                        result => 
                            <div className="add-song">
                                <img src={result.album.images[2].url}></img>
                                    <div className="add-songs-info">
                                        <p>{result.name} - {result.artists[0].name} 
                                            <br></br>
                                            {result.album.name}
                                        </p>
                                    </div>
                                <button 
                                    id={result.uri} 
                                    onClick={context[10].addTracks}>Add Song
                                </button>
                            </div>
                    ) : null}
            </div>
        </div>
        {playlist ? 
            <div className="add-songs-playlist">
                <h1>{playlist.name}</h1>
                <h2>{playlist.description}</h2>
                {playlist.tracks.items.map(element => 
                    <p>{element.track.name} - {element.track.artists[0].name}
                        <button 
                            id={playlist.id} 
                            className={element.track.uri} 
                            onClick={context[12].deleteTrack}>Remove song
                        </button>
                    </p>)}
                    <button>
                        <a 
                            href={playlist.external_urls.spotify}>
                            Play on Spotify
                        </a>
                    </button>
            </div> : null}
    </div> : <h1>You are no longer signed in</h1>
}

