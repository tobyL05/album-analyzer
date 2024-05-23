import { Albums, Artist, type Item, type spotifySearchResult } from ".";

interface searchResult {
    albumId: string,
    albumName: string,
    albumArtists: string[],
    albumCover: string,
}

// returns searchResults[]
export function parseSearchAlbumResponse(response: spotifySearchResult)  {
    let results: searchResult[] = []
    const albums: Item[] = response.albums.items;
    albums.forEach((album: Item) => {
        results.push({
            albumId: album.id,
            albumName: album.name,
            albumArtists: album.artists.map((artist: Artist) => artist.name),
            albumCover: album.images[0].url
        })
    })
    console.log(results)

    return results;
}