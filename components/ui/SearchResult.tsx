import { album} from "../../shared/types";
import Image from "next/image";


interface props {
    album: album
}

export default function SearchResult({ album }: props) {
    return (
        <>
            <div className="flex flex-row items-center space-x-4 rounded-full">
                <Image src={album.cover} width={64} height={64} alt="album cover"/>
                <div> 
                    <h1 className="text-xl">{ album.name}</h1>
                    <h1 className="text-sm">{ album.artists.join(", ") }</h1>
                </div>
            </div>
            <h1 className="text-xl">({ album.release })</h1>
        </>
    )

}