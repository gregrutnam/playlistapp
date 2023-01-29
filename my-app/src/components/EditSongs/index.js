import { useOutletContext } from "react-router-dom";

export default function EditSongs({playlist}) {
    const context = useOutletContext();

    return playlist ? 
            <div className="add-songs-playlist">             
                <h2>{playlist.name}</h2>
                <h3>{playlist.description}</h3>
                <img src={playlist.images[0].url}></img>
                <div className="add-songs-tracks">{playlist.tracks.items.map(element => 
                    <p>{element.track.name} - {element.track.artists[0].name}
                        <button 
                            id={playlist.id} 
                            className={element.track.uri}
                            name={`${element.track.name} by ${element.track.artists[0].name}`}
                            onClick={context.deleteTrack}>Remove
                        </button>
                    </p>)}</div>
                    <button>
                        <a 
                            href={playlist.external_urls.spotify}>
                            Play on Spotify
                        </a>
                    </button>
            </div> : null
}