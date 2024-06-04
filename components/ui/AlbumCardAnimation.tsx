"use client"

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

interface props {
    name: string,
    artists: string,
}

export default function AlbumCardAnimation({ name, artists } : props) {

    const [renderName, setRenderName] = useState(false);
    const [renderArtist, setRenderArtist] = useState(false);

    useEffect(() => {
        const name = setTimeout(() => {
            setRenderName(true);
        },200)

        const artists = setTimeout(() => {
            setRenderArtist(true)
        },600)

        return () => {
            clearTimeout(name);
            clearTimeout(artists);
        }
    })

    return (
        <>
            <div className="flex flex-col space-y-2 items-start">
                {renderName ? <TypeAnimation className="text-4xl font-bold" sequence={[name]} speed={50} cursor={false}/> : null}
                {renderArtist ? <TypeAnimation className="text-lg" sequence={[artists]} speed={50} cursor={false}/> : null}
            </div>
        </>
    )
}