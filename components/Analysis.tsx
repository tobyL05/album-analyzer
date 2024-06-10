
import axios from "axios";
import { Suspense } from "react";
import AlbumCard from "./ui/AlbumCard";
import { cn } from "@/lib/utils";
import AlbumAnalysis from "./ui/AlbumAnalysis";
import { GetAlbumResponse } from "./types";
import { cookies } from "next/headers";

interface props {
    className: string
    album_id: string
}

export default async function Analysis({ className, album_id } : props) {


    const ACCESS_TOKEN = cookies().get("access_token")?.value
    let albumInfo: GetAlbumResponse;
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
            <h1>Error fetching data</h1>
        )
    }


    return (
        <div className={cn(className)}>
            <AlbumCard album={albumInfo}/>
            <br></br>
            <AlbumAnalysis album={albumInfo}/>
        </div>
    )
}