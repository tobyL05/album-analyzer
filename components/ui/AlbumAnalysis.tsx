import { cookies } from "next/headers"
import { AudioFeature, AlbumResponse, GetSeveralTracksAudioFeaturesResponse, GetSeveralTracksResponse, Item, Track } from "../types"
import axios from "axios"
import { Rating, Tooltip } from "@mui/material"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"

interface props {
    album: AlbumResponse
}

const FEATURE_ADJ = ["acoustic", "danceable", "energetic", "instrumental", "\"live\"","\"speechy\"","tempo","\"happy\""]
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
const FEATURE_INFO = [
    "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
    "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
    "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy. ",
    "Predicts whether a track contains no vocals. \"Ooh\" and \"aah\" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly \"vocal\". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.",
    "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
    "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
    "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
    "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
]

interface TrackInfo {
  track_name: string
  track_id: string
  track_duration_ms: number
  track_popularity: number
  track_features: number[]
}

// most and least popular
// shorted and longest track

interface averages {
    avg_popularity: number
    avg_duration_ms: number
    avg_features: number[]
}

interface superlative {
    track: TrackInfo
    value: number
}

interface superlatives {
    most: superlative[]
    least: superlative[]
}

// Max 50 tracks per album
// keep track of duration, ids, explicit?
function getAlbumTrackIDs(album: AlbumResponse) {
    return album.tracks.items.map((item: Item) => {
        return item.id
    })
}

// Requires a list of track ids
// Returns a an array of TrackInfo
async function getTrackDetails(trackIds: string[]) {
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
    const getSeveralTracksFeaturesResp: GetSeveralTracksAudioFeaturesResponse = await getSeveralTracksFeaturesReq?.data
    getSeveralTracksFeaturesResp.audio_features.map((feature: AudioFeature,index) => {
        tracks[index].track_features = FEATURE_NAMES.map((feature_name: string) => {
            return feature[feature_name as keyof AudioFeature] as number;
        })
    })

   return tracks;
}

function getSuperlative(tracks: TrackInfo[], most: boolean) {
    return FEATURE_NAMES.map((feature: string, index: number) => {
        const sortedTracks: TrackInfo[] = tracks.sort((a: TrackInfo, b: TrackInfo) => {
            return (b.track_features[index] - a.track_features[index]) * (most ? 1 : -1) // desc if most, otherwise asc
        })
        return {
            track: sortedTracks[0],
            value: sortedTracks[0].track_features[index]
        }
    })
}

// // call once to get all properties or call for each property?
function getSuperlatives(tracks: TrackInfo[]) {
    return {
        most: getSuperlative(tracks, true),
        least: getSuperlative(tracks, false)
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
    return (hrs == 0 ? "" : hrs + " hrs ") + mins + " min " + (hrs > 0 ? "" : secs + " sec")
}

function capitalize(word: string){ 
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function round(value: number) {
    return +parseFloat(value.toString())
}

export default async function AlbumAnalysis({ album }: props) {

    const trackIds: string[] = getAlbumTrackIDs(album);
    let tracks: TrackInfo[]
    try {
        tracks = await getTrackDetails(trackIds);
    } catch (error) {
        return <h1>Error getting album tracks</h1>
    }

    const averages: averages = calculateAverages(tracks);
    const superlatives: superlatives = getSuperlatives(tracks);

    return (
        <>
            <div className="w-full md:w-3/4 mx-auto mt-5">
                <h1 className="font-bold text-2xl my-2">Features (scaled out of 10)</h1>
                    <Accordion type="multiple" className="py-1">
                        {averages.avg_features.map((feature: number,index: number) => {
                            let value: string | number;
                            if (FEATURE_NAMES[index] === "tempo") {
                                value = round(feature).toFixed(1).concat(" Bpm")
                            } else {
                                value = (round(feature) * 10).toFixed(1).concat("/10")
                            }

                            return(
                                <AccordionItem key={index} value={FEATURE_NAMES[index]} className="w-full my-3">
                                    <AccordionTrigger className="bg-primary text-white rounded-lg">
                                        <span className="grow text-xl inline-flex justify-between items-center p-3 md:px-5">
                                            <h1 className="font-bold w-1/2 text-left truncate">{ capitalize(FEATURE_NAMES[index]) }</h1>
                                            <h1 className="tracking-wide">{ value }</h1>
                                        </span>
                                        <ChevronDown className="h-6 w-1/6 shrink-0 transition-transform duration-200 pr-3" />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-5 bg-white text-black text-lg">
                                        <h1 className="my-3">{ FEATURE_INFO[index] }</h1>
                                        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row justify-start md:space-x-10">
                                            <div className="md:w-1/2">
                                                <h1 className="font-bold"> {index == 6 ? "Highest" : "Most"} { FEATURE_ADJ[index] }</h1>
                                                <span className="text-md flex flex-row justify-between">
                                                    <h1 className="w-fit">{ superlatives.most[index].track.track_name}</h1>
                                                    <h1 className="w-fit">{ superlatives.most[index].value }</h1>
                                                </span>
                                            </div>
                                            <div className="md:w-1/2">
                                                <h1 className="font-bold"> {index == 6 ? "Lowest" : "Least" } { FEATURE_ADJ[index] }</h1>
                                                <span className="text-md flex flex-row justify-between">
                                                    <h1 className="">{ superlatives.least[index].track.track_name}</h1>
                                                    <h1 className="">{ superlatives.least[index].value }</h1>
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem> 
                            )
                        })}
                    </Accordion>
                <div className="w-full mx-auto flex flex-col space-y-3 md:flex-row md:space-y-0 md:justify-between md:space-x-3">
                        <div className="grow bg-blue-500 text-white p-5 rounded-lg">
                            <h1 className="text-2xl font-bold">Avg. track popularity</h1>
                            <h1>{ round(averages.avg_popularity).toFixed(1) }/100</h1>
                        </div>
                    <div className="grow bg-rose-500 text-white p-5 rounded-lg">
                        <h1 className="text-2xl font-bold">Avg. track duration</h1>
                        <h1>{ parseDuration(averages.avg_duration_ms) }</h1>
                    </div>
                </div>
            </div>
        </>
    )
    


}