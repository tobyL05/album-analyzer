import axios from "axios";
import AlbumCard from "./ui/AlbumCard";
import { cn } from "@/lib/utils";
import AlbumAnalysis from "./ui/AlbumAnalysis";
import { cookies } from "next/headers";
import { AlbumResponse } from "@/shared/types";

interface props {
    className: string
    album_id: string
}

export default async function Analysis({ className, album_id } : props) {


    const ACCESS_TOKEN = cookies().get("access_token")?.value
    let albumInfo: AlbumResponse;
    try {
        const getAlbumInfo = await axios.get(`https://api.spotify.com/v1/albums/${album_id}`,{
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        })
        if (getAlbumInfo.status == 200) {
            albumInfo = await getAlbumInfo.data;
        } else {
            throw new Error("API Error")
        }
    } catch (error) {
        return (
            <h1 className="w-1/2 p-4 my-10 mx-auto">An error occurred! Try searching again.</h1>
        )
    }

    return (
        <div className={cn(className)}>
            <AlbumCard album={albumInfo}/>
            <AlbumAnalysis album={albumInfo}/>
        </div>
    )
}