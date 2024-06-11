
export interface ArtistResponse {
  artists: Artist2[]
}

export interface AlbumResponse {
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
  
  interface Image {
    url: string
    height: number
    width: number
  }
  
  interface Tracks {
    items: Item[]
  }
  
  export interface Item {
    artists: Artist2[]
    duration_ms: number
    href: string
    id: string
    is_playable: boolean
    name: string
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
  }
  
export interface GetSeveralTracksResponse {
  tracks: Track[]
}

export interface Track {
  [x: string]: string
  duration_ms: number
  name: string
  popularity: number
}

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  id: string
  images: Image[]
  name: string
  release_date: string
  artists: Artist[]
}

interface Image {
  url: string
  height: number
  width: number
}

export interface Artist {
  [x: string]: any
  genres: string[]
  name: string
}

export interface GetSeveralTracksAudioFeaturesResponse {
  audio_features: AudioFeature[]
}

export interface AudioFeature {
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
