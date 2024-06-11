"use client"

import axios from "axios";
import { NewReleaseItems, NewReleases } from "@/shared/types";
import Marquee from "react-fast-marquee";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TypeAnimation } from 'react-type-animation';


async function fetchNewReleases() {
    const newReleasesReq = await axios.get("/api/v1/releases")
    const newReleasesResp: NewReleases = await newReleasesReq.data
    return newReleasesResp.albums.items;
}


export default function AlbumMarquee() {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [albums,setAlbums] = useState<NewReleaseItems[]>()

    useEffect(() => {
        fetchNewReleases()
        .then((result: NewReleaseItems[]) => {setAlbums(result)})
    },[])

    function select(album_id: string){
        const query = new URLSearchParams(searchParams);
        query.set("album_id",album_id)
        router.push(pathName+ "?" + query.toString());
    }

    return (
        // make this fade in?
        <>
            <TypeAnimation 
                className="text-2xl font-semibold mb-3"
                sequence={["or any of these new releases..."]}
                wrapper="span"
                speed={50}
                repeat={0}
                cursor={false}/>
            <Marquee autoFill={true} pauseOnHover={true} pauseOnClick={true} speed={80}>
                {albums ? albums.map((album) => {
                    return (
                        <div key={album.id} className="group mx-4 px-8 py-10 rounded-lg hover:bg-secondary hover:cursor-pointer" onClick={() => {select(album.id)}}>
                            <Image className="" src={album.images[0].url} width={200} height={200} alt="album cover"/>
                            <div className="py-3">
                                <h1 className="w-[200px] text-xl truncate font-semibold opacity-0 group-hover:opacity-100 group-hover:transition group-hover:ease-in-out">{ album.name }</h1>
                                <h1 className="w-[200px] text-sm truncate opacity-0 group-hover:opacity-100 group-hover:transition-all group-hover:ease-in-out">{ album.artists.map((artist) => {return artist.name}).join(", ") }</h1>
                            </div>
                        </div>
                    )
                }) : null}
            </Marquee>
        </>
    )

}