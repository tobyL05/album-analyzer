
// SPOTIFY API RESPONSES
interface NewReleases {
  albums: {
    items : NewReleaseItems[]
  }
}

interface ArtistResponse {
  artists: Artist[]
}

interface AudioFeaturesResponse {
  audio_features: AudioFeature[]
}

interface SeveralTracksResponse {
  tracks: Item[]
}

interface AlbumResponse {
  album_type: string
  total_tracks: number
  available_markets: string[]
  id: string
  images: Image[]
  name: string
  release_date: string
  artists: Artist[]
  tracks: Tracks
  genres: any[]
  popularity: number
}

interface SearchResultResponse {
  albums: Albums
}

interface AccessTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number
}

interface Album {
    id: string,
    name: string,
    artists: string[],
    cover: string,
    release: string
}

interface NewReleaseItems {
    id: string
    name: string
    artists: [
      {
        name: string
      }
    ]
    images: [
      {
        url: string
        width: number
        height: number
      }
    ]
}

interface Tracks {
  items: Item[]
}

interface Item {
  [x: string]: any
  id: string
  duration_ms: number
  name: string
  popularity: number
}

interface Image {
  url: string
  height: number
  width: number
}

interface Artist {
  [x: string]: any
  genres: string[]
  name: string
}

interface AudioFeature {
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  type: string
  id: string
  uri: string
  track_href: string
  analysis_url: string
  duration_ms: number
  time_signature: number
}


export { Album, Artist, NewReleases, NewReleaseItems, ArtistResponse, AlbumResponse, SeveralTracksResponse, AudioFeaturesResponse, AudioFeature, SearchResultResponse, Item, AccessTokenResponse}