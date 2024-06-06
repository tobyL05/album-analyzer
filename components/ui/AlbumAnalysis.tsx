import { cookies } from "next/headers"
import { AudioFeature, GetAlbumResponse, GetSeveralTracksAudioFeaturesResponse, GetSeveralTracksResponse, Item, Track } from "../types"
import axios from "axios"

interface props {
    album: GetAlbumResponse
}

interface TrackInfo {
  track_name: string
  track_id: string
  track_duration_ms: number
  track_popularity: number
  track_features: TrackFeatures | {}
//   track_features?: avgFeatures
}

interface TrackFeatures {
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    liveness: number
    speechiness: number
    tempo: number
    valence: number
}

// most and least popular
// shorted and longest track

interface averages {
    avg_popularity: number
    avg_duration_ms: number
}

interface superlatives {
    most_popular: TrackInfo
    least_popular: TrackInfo
    longest: TrackInfo
    shortest: TrackInfo
    most: {
        acousticness: TrackInfo
        danceability: TrackInfo
        energy: TrackInfo
        instrumentalness: TrackInfo
        key: TrackInfo
        liveness: TrackInfo
        speechiness: TrackInfo
        tempo: TrackInfo
        valence: TrackInfo
    }
    least: {
        acousticness: TrackInfo
        danceability: TrackInfo
        energy: TrackInfo
        instrumentalness: TrackInfo
        key: TrackInfo
        liveness: TrackInfo
        speechiness: TrackInfo
        tempo: TrackInfo
        valence: TrackInfo
    }
}

// most and least ... for each feature

// Max 50 tracks per album
// keep track of duration, ids, explicit?
function getAlbumTrackIDs(album: GetAlbumResponse) {
    return album.tracks.items.map((item: Item) => {
        return item.id
    })
}

// Requires a list of track ids
// Returnsa map of trackid -> trackInfo
async function getTrackDetails(trackIds: string[]) {
    let tracks = new Map<string, TrackInfo>()
    const ACCESS_TOKEN = cookies().get("access_token")?.value
    const getSeveralTracksReq = await axios.get("https://api.spotify.com/v1/tracks?" + new URLSearchParams({
        ids: trackIds.join(",")
    }),{
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        } 
    })
    const getSeveralTracksResp: GetSeveralTracksResponse = await getSeveralTracksReq.data
    getSeveralTracksResp.tracks.forEach((track: Track) => {
        tracks.set(track.id,{
            track_name: track.name,
            track_id: track.id,
            track_duration_ms: track.duration_ms,
            track_popularity: track.popularity,
            track_features: {}
        })
    })
    return tracks
}

// max 50
// Requires a map of trackId -> trackInfo
// Returns an edited map with trackInfo + features
async function getTrackFeatures(tracksMap: Map<string, TrackInfo>) {
    const ACCESS_TOKEN = cookies().get("access_token")?.value

    const getSeveralTracksFeaturesReq = await axios.get("https://api.spotify.com/v1/audio-features?" + new URLSearchParams({
        ids: [...tracksMap.keys()].join(",")
    }), {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })

    const getSeveralTracksFeaturesResp: GetSeveralTracksAudioFeaturesResponse = await getSeveralTracksFeaturesReq.data
    getSeveralTracksFeaturesResp.audio_features.forEach((feature: AudioFeature) => {
        const track: TrackInfo = tracksMap.get(feature.id)!
        track.track_features = {
            acousticness: feature.acousticness,
            danceability: feature.danceability,
            energy: feature.energy,
            instrumentalness: feature.instrumentalness,
            liveness: feature.liveness,
            speechiness: feature.speechiness,
            tempo: feature.tempo,
            valence: feature.valence
        }
    })
}



export default async function AlbumAnalysis({ album }: props) {

    const trackIds: string[] = getAlbumTrackIDs(album);
    const tracksMap: Map<string, TrackInfo> = await getTrackDetails(trackIds);
    await getTrackFeatures(tracksMap);



    // console.log(tracksMap)
    return (
        <>
        </>
    )
    


}