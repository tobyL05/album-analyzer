import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { type accessTokenResponse, type spotifySearchResult } from ".";
import { parseSearchAlbumResponse } from "./services";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;



async function getAccessToken() {
    let options = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded',
          'Authorization': "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
        },
        params: {
          grant_type: 'client_credentials'
        }
      }
    const req = await axios(options)
    const resp = await req.data;
    return resp;
}


// returns an array of search results
export async function GET(request: NextRequest) {
    const resp:accessTokenResponse = await getAccessToken();
    const ACCESS_TOKEN = resp.access_token;
    // console.log(resp.access_token);
    const params = new URLSearchParams(request.nextUrl.searchParams);
    // console.log(params.toString())
    // console.log(params.get("search"))
    const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
            'q': params.get("search"),
            'type': 'album',
            'limit': 5,
        },
        headers: {
            'Authorization': "Bearer " + ACCESS_TOKEN
        }
    });

    const result: spotifySearchResult = await response.data;
    const cleaned_result = parseSearchAlbumResponse(result)

    return NextResponse.json({
        results: cleaned_result
    })
}

