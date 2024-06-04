import axios from "axios";
import { Artist, GetAlbumResponse } from "../types";
import { cookies } from "next/headers";
import { Rating } from "@mui/material";

interface props {
    album_id: string
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

export default async function AlbumCard( { album_id } : props) {

    const ACCESS_TOKEN = cookies().get("access_token")?.value
    if (album_id && ACCESS_TOKEN) {
        const getAlbumInfo = await axios.get(`https://api.spotify.com/v1/albums/${album_id}`,{
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        })

        const albumInfo:GetAlbumResponse = await getAlbumInfo.data;

        return (
            <>
                <div className="w-full md:w-3/4 mx-auto border-[1px] border-black rounded-lg p-5 flex flex-row items-center space-x-4">
                    <img className="" src={albumInfo.images[0].url} width={150} height={150} alt={albumInfo.name + " cover"}/>
                    <div className="mt-3">
                        <h1 className="text-2xl md:text-4xl"> { albumInfo.name }</h1>
                        <h1 className="text-sm">{ parseArtists(albumInfo.artists) }</h1>
                    </div>
                </div>
                <br></br>
                <div className="w-full md:w-3/4 mx-auto flex flex-col space-y-3 md:grid md:grid-cols-3 md:space-y-0 md:space-x-4">
                    <div className="p-5 bg-primary text-white rounded-lg">
                        <h1 className="text-2xl font-bold">Release</h1>
                        <h1 className="text-sm">{ parseDate(albumInfo.release_date) }</h1>
                    </div>
                    <div className="p-5 bg-secondary rounded-lg border-black border-[1px]">
                        <h1 className="text-2xl font-bold">Length</h1>
                        <h1 className="text-sm">{ albumInfo.total_tracks} tracks</h1>
                    </div>
                    <div className="p-5 bg-blue-500 text-white rounded-lg">
                        <h1 className="text-2xl font-bold">Popularity</h1>
                        <Rating value={ albumInfo.popularity/20 } precision={0.5} readOnly/>
                    </div>
                </div>
            </>
        )
    } else {
        // do some default loading component
        return(
            <> </>
        );
    }

    

}