
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
    const getAlbumInfo = await axios.get(`https://api.spotify.com/v1/albums/${album_id}`,{
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })

    const albumInfo:GetAlbumResponse = await getAlbumInfo.data;

    if (album_id) {
        return (
            <div className={cn(className)}>
                <AlbumCard album={albumInfo}/>
                <AlbumAnalysis album={albumInfo}/>
            </div>
        )
    } else {
        return <>Loading</>
    }
}