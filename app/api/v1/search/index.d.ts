export interface Albums {
  href: string
  limit: number
  next: string
  offset: number
  previous: any
  total: number
  items: Item[]
}

export interface Item {
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
  type: string
  uri: string
  artists: Artist[]
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

interface ExternalUrls2 {
  spotify: string
}

export interface accessTokenResponse {
    access_token: string,
    token_type: string,
    expires_in: number
}

export interface spotifySearchResult {
  albums: Albums
}
