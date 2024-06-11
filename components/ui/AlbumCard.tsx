import axios from "axios";
import { AlbumResponse, Artist, ArtistResponse, Item } from "../types";
import { cookies } from "next/headers";
// import { Divider, Rating, Tooltip } from "@mui/material";
import { Rating } from "@smastrom/react-rating"
import Image from 'next/image'
import SpotifyLogo from "../../public/images/spotify_icon.png"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { AVAILABLE_MARKETS, COUNTRIES } from "@/public/content";


interface props {
    album: AlbumResponse
}

// function parseArtists(artists: Artist[]) {
//     return artists.map((artist) => {
//         return artist.name
//     }).join(", ")
// }

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
    const resp: ArtistResponse = await req.data
    return resp;
}

function getGenres(resp: ArtistResponse) {
    let genresMap = new Map<string, number>()

    resp.artists.map((artist: Artist) => {
        return artist.genres!.forEach((genre) => {
            let genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
            let count = genresMap.get(genreName);
            genresMap.set(genreName, count ? count + 1 : 1)
        })
    })

    if (genresMap.size == 0) {
        return "No genres detected. Is this album by \"Various Artists\"?";
    }

    return [...genresMap.entries()]
    .sort((a,b) => b[1]-a[1])
    .map((el) => {return el[0].split(" ").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ")})
    .slice(0,3).join(", ");
}

export default async function AlbumCard( { album } : props) {

    const artistInfo: ArtistResponse = await getArtist(album.artists);

    return (
        <div className="">
            <div className="relative w-full md:w-3/4 mx-auto h-[352px] mb-4">
                <iframe className="absolute rounded-lg mb-3 z-10" src={`https://open.spotify.com/embed/album/${album.id}?utm_source=generator`} width="100%" height="352" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"/>
                <h1 className="absolute text-center bottom-0 left-0 z-0">loading album...</h1>
            </div>
            <div className="w-full md:w-3/4 mx-auto flex flex-col space-y-3 md:grid md:gap-2 md:space-y-0 md:place-items-stretch md:grid-cols-3 md:grid-rows-2">
                <div className="p-5 md:row-span-2 bg-primary text-white rounded-lg">
                    <div>
                        <h1 className="text-2xl font-bold">Release</h1>
                        <h1 className="text-sm">{ parseDate(album.release_date) }</h1>
                    </div>
                    <hr className="my-4"></hr>
                    <div>
                        <h1 className="text-2xl font-bold">Length</h1>
                        <h1 className="text-sm">{ album.total_tracks} tracks</h1>
                    </div>
                    <hr className="my-4"></hr>
                    <div>
                        <h1 className="text-2xl font-bold">Popularity</h1>
                        <h1>Rating: { album.popularity }/100</h1>
                    </div>
                </div>
                    <div className="p-5 bg-blue-500 text-white rounded-lg col-span-2">
                        <h1 className="text-2xl font-bold">Genres</h1>
                        <h1 className="text-lg">{ getGenres(artistInfo) }</h1>
                    </div>
                <div className="col-span-2 flex flex-col space-y-3 md:flex-row justify-evenly md:space-y-0 md:space-x-2 md:justify-between">
                    <div className="grow p-5 bg-red-500 text-white rounded-lg">
                        <h1 className="text-2xl font-bold">Duration</h1>
                        <h1 className="text-lg truncate">{ getAlbumDuration(album.tracks.items) }</h1>
                    </div>
                    <div className="grow p-5 bg-secondary border-[1px] border-secondary-foreground rounded-lg">
                        <h1 className="text-2xl font-bold">Availability</h1>
                        <h1 className="text-lg">{ album.available_markets.length }/185 markets ({ getAlbumAvailability(album.available_markets).toFixed(1) }%)</h1>
                    </div>
                </div>
            </div>
        </div>
    )

    

}