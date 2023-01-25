import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function AddSongs() {
    const context = useOutletContext();
    const spotifyToken = context.spotifyToken
    const results = context.results;
    const playlist = context.playlist;

    return spotifyToken ? <div className="add-songs-container">
        <div className="add-songs-search">
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
                                    onClick={context.addTracks}>Add Song
                                </button>
                            </div>
                    ) : null}
            </div>
        </div>
        {playlist ? 
            <div className="add-songs-playlist">             
                <h2>{playlist.name}</h2>
                <h3>{playlist.description}</h3>
                {playlist.tracks.items.map(element => 
                    <p>{element.track.name} - {element.track.artists[0].name}
                        <button 
                            id={playlist.id} 
                            className={element.track.uri}
                            name={`${element.track.name} by ${element.track.artists[0].name}`}
                            onClick={context.deleteTrack}>Remove song
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

