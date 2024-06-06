import axios from "axios";
import { Artist, GetAlbumResponse, GetArtistResponse } from "../types";
import { cookies } from "next/headers";
import { Rating } from "@mui/material";

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

async function getGenres(artists: Artist[]) {
    const ACCESS_TOKEN = cookies().get("access_token")?.value
    let genresMap = new Map<string, number>()
    const query = artists.map((artist) => {
        return artist.id
    }).join(",")

    const req = await axios.get(`https://api.spotify.com/v1/artists?ids=${query}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })
    const resp: GetArtistResponse = await req.data

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

    return (
        <>
            <div className="w-full md:w-3/4 mx-auto border-[1px] border-black rounded-lg p-5 flex items-start flex-col space-x-0 md:items-center md:flex-row md:space-x-4">
                <img className="rounded-lg" src={album.images[0].url} width={300} height={300} alt={album.name + " cover"}/>
                <div className="mt-3">
                    <h1 className="text-2xl md:text-4xl font-semibold"> { album.name }</h1>
                    <h1 className="text-md">{ parseArtists(album.artists) }</h1>
                </div>
            </div>
            <br></br>
            <div className="w-full md:w-3/4 mx-auto flex flex-col space-y-3 md:flex-row md:space-y-0 md:justify-stretch md:space-x-4">
                <div className="w-full p-5 bg-primary text-white rounded-lg">
                    <h1 className="text-2xl font-bold">Release</h1>
                    <h1 className="text-sm">{ parseDate(album.release_date) }</h1>
                </div>
                <div className="w-full p-5 bg-secondary rounded-lg border-black border-[1px]">
                    <h1 className="text-2xl font-bold">Length</h1>
                    <h1 className="text-sm">{ album.total_tracks} tracks</h1>
                </div>
                <div className="w-full p-5 bg-blue-500 text-white rounded-lg">
                    <h1 className="text-2xl font-bold">Popularity</h1>
                    <Rating value={ album.popularity/20 } precision={0.5} readOnly/>
                </div>
            </div>
            <div className="mt-3 w-full md:w-3/4 mx-auto p-5 bg-blue-500 text-white rounded-lg">
                <h1 className="text-2xl font-bold">Genres</h1>
                <h1 className="">{ getGenres(album.artists) }</h1>
            </div>
        </>
    )

    

}