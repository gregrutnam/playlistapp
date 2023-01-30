import { v4 as uuidv4 } from 'uuid';
import EditDetails from "../EditDetails";
import { useOutletContext } from "react-router-dom";

export default function Edit() {
    const context = useOutletContext();
    console.log(context.playlist)
    return context.playlist ? 
            <div className="add-songs-playlist">     
                <EditDetails/>
                <div className="add-songs-tracks">{context.playlist.tracks.items.map(element => 
                    <p key={uuidv4()}>{element.track.name} - {element.track.artists[0].name}
                        <button 
                            id={element.id} 
                            className={element.track.uri}
                            name={`${element.track.name} by ${element.track.artists[0].name}`}
                            onClick={context.deleteTrack}>Remove
                        </button>
                    </p>)}</div>
                    <button>
                        <a 
                            href={context.playlist.external_urls.spotify}>
                            Play on Spotify
                        </a>
                    </button>
            </div> : null
}