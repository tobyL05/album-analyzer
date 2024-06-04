export interface GetAlbumResponse {
    album_type: string
    total_tracks: number
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
  
  export interface Image {
    url: string
    height: number
    width: number
  }
  
  export interface Artist {
    external_urls: ExternalUrls2
    href: string
    id: string
    name: string
    type: string
    uri: string
  }
  
  export interface ExternalUrls2 {
    spotify: string
  }
  
  export interface Tracks {
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
  
  export interface Artist2 {
    external_urls: ExternalUrls3
    href: string
    id: string
    name: string
    type: string
    uri: string
  }
  
  export interface ExternalUrls3 {
    spotify: string
  }
  
  export interface ExternalUrls4 {
    spotify: string
  }
  
  export interface Copyright {
    text: string
    type: string
  }
  
  export interface ExternalIds {
    upc: string
}
  