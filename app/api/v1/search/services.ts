import { album } from "@/shared/types";
import { Artist, type Item, type spotifySearchResult } from ".";

// returns searchResults[]
export function parseSearchAlbumResponse(response: spotifySearchResult)  {
    let results: album[] = [];
    let added: string[] = [];
    const albums: Item[] = response.albums.items;
    albums.forEach((album: Item) => {
        // check if album name already contained
        if (!added.includes(album.name)) {
            added.push(album.name);
            results.push({
                id: album.id,
                name: album.name,
                artists: album.artists.map((artist: Artist) => artist.name),
                cover: album.images[0].url,
                release: album.release_date.slice(0,4),
            })
        }
    })

    return results;
}