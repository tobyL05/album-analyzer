
export interface GetArtistResponse {
  artists: Artist2[]
}

export interface GetAlbumResponse {
    album_type: string
    total_tracks: number
    available_markets: string[]
    is_playable: boolean
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    type: string
    uri: string
    artists: Artist[]
    tracks: Tracks
    copyrights: Copyright[]
    external_ids: ExternalIds
    genres: any[]
    label: string
    popularity: number
  }
  
   interface ExternalUrls {
    spotify: string
  }
  
  interface Image {
    url: string
    height: number
    width: number
  }
  
  interface Artist {
    external_urls: ExternalUrls2
    href: string
    id: string
    name: string
    type: string
    uri: string
    genres?: string[]
  }
  
  interface ExternalUrls2 {
    spotify: string
  }
  
  interface Tracks {
    href: string
    limit: number
    next: any
    offset: number
    previous: any
    total: number
    items: Item[]
  }
  
  export interface Item {
    artists: Artist2[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_urls: ExternalUrls4
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
  
  interface Artist2 {
    external_urls: ExternalUrls3
    href: string
    id: string
    name: string
    type: string
    uri: string
  }
  
  interface ExternalUrls3 {
    spotify: string
  }
  
  interface ExternalUrls4 {
    spotify: string
  }
  
  interface Copyright {
    text: string
    type: string
  }
  
  interface ExternalIds {
    upc: string
}

export interface GetSeveralTracksResponse {
  tracks: Track[]
}

export interface Track {
  album: Album
  artists: Artist2[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls4
  href: string
  id: string
  is_playable: boolean
  linked_from: {}
  restrictions: Restrictions2
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: Restrictions
  type: string
  uri: string
  artists: Artist[]
}

interface ExternalUrls {
  spotify: string
}

interface Image {
  url: string
  height: number
  width: number
}

interface Restrictions {
  reason: string
}

interface Artist {
  external_urls: ExternalUrls2
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface ExternalUrls2 {
  spotify: string
}

export interface Artist2 {
  external_urls: ExternalUrls3
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image2[]
  name: string
  popularity: number
  type: string
  uri: string
}

interface ExternalUrls3 {
  spotify: string
}

interface Followers {
  href: string
  total: number
}

interface Image2 {
  url: string
  height: number
  width: number
}

interface ExternalIds {
  isrc: string
  ean: string
  upc: string
}

interface ExternalUrls4 {
  spotify: string
}

interface Restrictions2 {
  reason: string
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
