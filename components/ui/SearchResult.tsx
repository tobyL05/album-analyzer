import { Album } from "../../shared/types";
import Image from "next/image";


interface props {
    album: Album
}

export default function SearchResult({ album }: props) {
    return (
        <>
            <div className="flex flex-row items-center space-x-4 rounded-full">
                <Image src={album.cover} width={100} height={100} alt="album cover"/>
                <div> 
                    <h1 className="text-xl font-semibold">{ album.name}</h1>
                    <h1 className="text-md">{ album.artists.join(", ") }</h1>
                </div>
            </div>
            <h1 className="hidden md:text-xl">({ album.release })</h1>
        </>
    )

}