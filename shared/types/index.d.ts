
type album = {
    id: string,
    name: string,
    artists: string[],
    cover: string,
    release: string
}

interface NewReleases {
  albums: {
    items : NewReleaseItems[]
  }
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

export { album, NewReleases, NewReleaseItems }