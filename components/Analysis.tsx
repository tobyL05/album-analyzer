
import axios from "axios";
import { Suspense } from "react";
import AlbumCard from "./ui/AlbumCard";
import { cn } from "@/lib/utils";

interface props {
    className: string
    album_id: string
}

export default async function Analysis({ className, album_id } : props) {

    return (
        <div className={cn(className)}>
            <Suspense fallback={<h1>Loading Album Info</h1>}>
                <AlbumCard album_id={album_id}/>
            </Suspense>
        </div>
    )

}