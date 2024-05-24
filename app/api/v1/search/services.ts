import { Albums, Artist, type Item, type spotifySearchResult } from ".";

interface searchResult {
    albumId: string,
    albumName: string,
    albumArtists: string[],
    albumCover: string,
    albumRelease: string,
}

// returns searchResults[]
export function parseSearchAlbumResponse(response: spotifySearchResult)  {
    let results: searchResult[] = [];
    let added: string[] = [];
    const albums: Item[] = response.albums.items;
    albums.forEach((album: Item) => {
        // check if album name already contained
        if (!added.includes(album.name)) {
            added.push(album.name);
            results.push({
                albumId: album.id,
                albumName: album.name,
                albumArtists: album.artists.map((artist: Artist) => artist.name),
                albumCover: album.images[0].url,
                albumRelease: album.release_date.slice(0,4),
            })
        }
    })
    console.log(results)

    return results;
}