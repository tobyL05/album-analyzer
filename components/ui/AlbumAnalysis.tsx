import { cookies } from "next/headers"
import { AudioFeature, GetAlbumResponse, GetSeveralTracksAudioFeaturesResponse, GetSeveralTracksResponse, Item, Track } from "../types"
import axios from "axios"
import { Key } from "react"
import { Divider } from "@mui/material"

interface props {
    album: GetAlbumResponse
}

const SUPERLATIVE_KEYS = ["most_popular","least_popular","longest","shortest","most","least"]
const FEATURE_NAMES = ["acousticness","danceability","energy","instrumentalness","liveness","speechiness","tempo","valence"]
const FEATURE_KEYS = new Map<string, number>([
    ["acousticness", 0],
    ["danceability",1],
    ["energy",2],
    ["instrumentalness",3],
    ["liveness",4],
    ["speechiness",5],
    ["tempo",6],
    ["valence",7],
])

interface TrackInfo {
  track_name: string
  track_id: string
  track_duration_ms: number
  track_popularity: number
  track_features: number[]
//   track_features?: avgFeatures
}

// most and least popular
// shorted and longest track

interface averages {
    avg_popularity: number
    avg_duration_ms: number
    avg_features: number[]
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
        // key: TrackInfo
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
        // key: TrackInfo
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
// Returns a an array of TrackInfo
async function getTrackDetails(trackIds: string[]) {
    // let tracks = new Map<string, TrackInfo>()
    let tracks: TrackInfo[] = []
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
        tracks.push({
            track_name: track.name,
            track_id: track.id,
            track_duration_ms: track.duration_ms,
            track_popularity: track.popularity,
            track_features: []
        })
    })
    const tracksComplete = await getTrackFeatures(tracks);
    return tracksComplete;
}

// max 50
// Requires an array of TrackInfo
// Returns the same array with each track_features property of each element populated
async function getTrackFeatures(tracks: TrackInfo[]) {
    const ACCESS_TOKEN = cookies().get("access_token")?.value

    const getSeveralTracksFeaturesReq = await axios.get("https://api.spotify.com/v1/audio-features?" + new URLSearchParams({
        ids: tracks.map((track: TrackInfo) => {return track.track_id}).join(",")
    }), {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })

    const getSeveralTracksFeaturesResp: GetSeveralTracksAudioFeaturesResponse = await getSeveralTracksFeaturesReq.data
    getSeveralTracksFeaturesResp.audio_features.map((feature: AudioFeature,index) => {
        tracks[index].track_features = [
            feature.acousticness,
            feature.danceability,
            feature.energy,
            feature.instrumentalness,
            feature.liveness,
            feature.speechiness,
            feature.tempo,
            feature.valence
        ]
   })

   return tracks;
}

function getSuperlative(tracks: TrackInfo[], metric: string, isFeature?: boolean) {
    return tracks
        .map((track: TrackInfo) => {
            return track.track_popularity
        })
        .sort()
}

// call once to get all properties or call for each property?
function getSuperlatives(tracks: TrackInfo[]) {
    return {
        most_popular: getSuperlative(tracks, "most_popular")
        // least_popular: TrackInfo
        // longest: TrackInfo
        // shortest: TrackInfo
        // most: {
        //     acousticness: TrackInfo
        //     danceability: TrackInfo
        //     energy: TrackInfo
        //     instrumentalness: TrackInfo
        //     // key: TrackInfo
        //     liveness: TrackInfo
        //     speechiness: TrackInfo
        //     tempo: TrackInfo
        //     valence: TrackInfo
        // }
        // least: {
        //     acousticness: TrackInfo
        //     danceability: TrackInfo
        //     energy: TrackInfo
        //     instrumentalness: TrackInfo
        //     // key: TrackInfo
        //     liveness: TrackInfo
        //     speechiness: TrackInfo
        //     tempo: TrackInfo
        //     valence: TrackInfo
        // }
    }
}

function calculateAverage(tracks: TrackInfo[], metric: string, isFeature?: boolean) {
    return tracks
            .map((track: TrackInfo) => {
               if (isFeature) {
                    return track["track_features"]![FEATURE_KEYS.get(metric)!]
                } else {
                    return track[metric as keyof TrackInfo] as number
                }
            })
            .reduce((sum, curr) => {return sum + curr},0) / tracks.length
}

function calculateAverages(tracks: TrackInfo[]) {
    return {
        avg_popularity: calculateAverage(tracks,"track_popularity"),
        avg_duration_ms: calculateAverage(tracks,"track_duration_ms"),
        avg_features: FEATURE_NAMES.map((feature) => {
            return calculateAverage(tracks,feature,true)
        })
    }
}

function parseDuration(duration_ms: number) {
    let ms = duration_ms % 1000;
    duration_ms = (duration_ms - ms) / 1000;
    let secs = duration_ms % 60;
    duration_ms = (duration_ms - secs) / 60;
    let mins = duration_ms % 60;
    let hrs = (duration_ms - mins) / 60;
    return (hrs == 0 ? "" : hrs + "h ") + mins + "m " + secs + "s"
}

function capitalize(word: string){ 
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function round(value: number) {
    return +parseFloat(value.toString()).toFixed(2) 
}

function getBgColor(val: number) {
    if (val < 0.3) {
        return "red-500"
    } else if (val >= 0.3 && val <= 0.6) {
        return "blue-500"
    } else {
        return "green-300"
    }
}

export default async function AlbumAnalysis({ album }: props) {

    const trackIds: string[] = getAlbumTrackIDs(album);
    const tracks: TrackInfo[] = await getTrackDetails(trackIds);

    const averages = calculateAverages(tracks);

    // how to display info? 
    return (
        <>
            <div className="w-full md:w-3/4 mx-auto mt-5">
                <div className="bg-primary text-white flex flex-col rounded-lg p-5">
                    {averages.avg_features.map((feature: number,index: number) => {
                        let value: string | number;
                        if (FEATURE_NAMES[index] === "tempo") {
                            value = round(feature).toString().concat(" bpm")
                        } else {
                            value = (round(feature) * 100).toFixed(1).concat(" / 100")
                        }
                        return(
                            <div key={index} className="">
                                <span className="w-full bg-primary p-5 text-white text-xl rounded-lg inline-flex items-center justify-between">
                                    <h1 className="font-bold">{ capitalize(FEATURE_NAMES[index]) }</h1>
                                    <h1 className="">{ value }</h1>
                                </span>
                                {index != averages.avg_features.length-1 ? <Divider orientation="horizontal" className="bg-white" variant="middle"/> : null}
                            </div>
                        )
                    })}
                </div>
                <h1>Average track popularity: { round(averages.avg_popularity) }</h1>
                <h1>Average track duration: { parseDuration(averages.avg_duration_ms) }</h1>
            </div>
        </>
    )
    


}