import axios from "axios";
import { Artist, Artist2, GetAlbumResponse, GetArtistResponse, Item } from "../types";
import { cookies } from "next/headers";
import { Divider, Rating, Tooltip } from "@mui/material";
import Image from 'next/image'
import SpotifyLogo from "../../public/images/spotify_icon.png"

interface props {
    album: GetAlbumResponse
}

function parseArtists(artists: Artist[]) {
    return artists.map((artist) => {
        return artist.name
    }).join(", ")
}

function parseDate(date: string) {
    let dateArr = date.split("-");
    let day: number = +dateArr[2];
    let month = ["January","February","March","April","May", "June", "July", "August", "September", "October", "November", "December"][+dateArr[1]-1];
    let year = dateArr[0];
    return day + " " + month + " " + year
}

function getAlbumDuration(tracks: Item[]) {
    let duration_ms = tracks.map((track: Item) => {return track.duration_ms}).reduce((sum,curr) => {return sum + curr},0)
    var ms = duration_ms % 1000;
    duration_ms = (duration_ms - ms) / 1000;
    var secs = duration_ms % 60;
    duration_ms = (duration_ms - secs) / 60;
    var mins = duration_ms % 60;
    var hrs = (duration_ms - mins) / 60;
    return (hrs == 0 ? "" : hrs + "hr ") + mins + " min " + (hrs > 0 ? "" : secs + " sec")
}

function getAlbumAvailability(markets: string[]) {
    const AVAILABLE_MARKETS = 185
    return (markets.length / AVAILABLE_MARKETS) * 100

}

async function getArtist(artists: Artist[]) {
    const ACCESS_TOKEN = cookies().get("access_token")?.value
    const query = artists.map((artist) => {
        return artist.id
    }).join(",")

    const req = await axios.get(`https://api.spotify.com/v1/artists?ids=${query}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })
    const resp: GetArtistResponse = await req.data
    return resp;
}

function getGenres(resp: GetArtistResponse) {
    let genresMap = new Map<string, number>()
    resp.artists.map((artist: Artist) => {
        return artist.genres!.forEach((genre) => {
            let genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
            let count = genresMap.get(genreName);
            genresMap.set(genreName, count ? count + 1 : 1)
        })
    })

    return [...genresMap.entries()]
    .sort((a,b) => b[1]-a[1])
    .map((el) => {return el[0].split(" ").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ")})
    .slice(0,3).join(", ");
}

export default async function AlbumCard( { album } : props) {

    const artistInfo: GetArtistResponse = await getArtist(album.artists);

    return (
        <>
            <iframe className="w-full md:w-3/4 mx-auto rounded-lg" src={`https://open.spotify.com/embed/album/${album.id}?utm_source=generator`} width="100%" height="352" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            {/* <div className="w-full md:w-3/4 mx-auto border-[1px] border-black rounded-lg p-5 flex items-start flex-col space-x-0 md:items-center md:flex-row md:space-x-4 relative">
                <img src={album.images[0].url} width={300} height={300} alt={album.name + " cover"}/>
                <div className="my-5">
                    <h1 className="text-2xl md:text-4xl font-semibold"> { album.name }</h1>
                    <h1 className="text-md">{ parseArtists(album.artists) }</h1>
                </div>
                <a href={album.external_urls.spotify} target="_blank" className="flex-none inline-flex items-center space-x-2 absolute bottom-2 right-2 bg-primary rounded-full text-white px-3 py-1">
                    <Image className="mx-auto bg-white rounded-full" src={SpotifyLogo} alt="Spotify logo" width={20} height={20}/>
                    <h1 className="text-sm font-semibold tracking-wider">PLAY ON SPOTIFY</h1>
                </a>
            </div> */}
            <br></br>
            <div className="w-full md:w-3/4 mx-auto flex flex-col space-y-3 md:grid md:gap-2 md:space-y-0 md:place-items-stretch md:grid-cols-3 md:grid-rows-2">
                <div className="p-5 md:row-span-2 bg-primary text-white rounded-lg">
                    <h1 className="text-2xl font-bold">Release</h1>
                    <h1 className="text-sm">{ parseDate(album.release_date) }</h1>
                    <Divider orientation="horizontal" className="my-2 bg-secondary"/>
                    <h1 className="text-2xl font-bold">Length</h1>
                    <h1 className="text-sm">{ album.total_tracks} tracks</h1>
                    <Divider orientation="horizontal" className="my-2 bg-secondary"/>
                    <Tooltip title={`This album has a popularity of ${album.popularity}/100`} leaveDelay={100}>
                        <>
                            <h1 className="text-2xl font-bold">Popularity</h1>
                            <Rating value={ album.popularity/20 } precision={0.5} readOnly/>
                        </>
                    </Tooltip>
                </div>
                <Tooltip 
                    title={getGenres(artistInfo)} 
                    slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [-30,-60],
                              },
                            },
                          ],
                        },
                      }}                
                    placement="top" 
                    leaveDelay={100} >
                    <div className="p-5 bg-blue-500 text-white rounded-lg col-span-2">
                        <h1 className="text-2xl font-bold">Genres</h1>
                        <h1 className="text-lg truncate">{ getGenres(artistInfo) }</h1>
                    </div>
                </Tooltip>
                <div className="col-span-2 flex flex-row justify-evenly space-x-2 md:justify-between">
                    <div className="grow p-5 bg-red-500 text-white rounded-lg">
                        <h1 className="text-2xl font-bold">Duration</h1>
                        <h1 className="text-lg truncate">{ getAlbumDuration(album.tracks.items) }</h1>
                    </div>
                    <Tooltip title={`This album is available in ${album.available_markets.length} out of 185 countries`} leaveDelay={100}>
                        <div className="grow p-5 bg-secondary border-[1px] border-secondary-foreground rounded-lg">
                            <h1 className="text-2xl font-bold">Availability</h1>
                            <h1 className="text-lg truncate">{ getAlbumAvailability(album.available_markets).toFixed(1) }%</h1>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </>
    )

    

}