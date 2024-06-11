import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { parseSearchAlbumResponse } from "./services";
import { cookies } from "next/headers";
import { validateToken } from "@/app/actions/action";
import { SearchResultResponse } from "@/shared/types";


// returns an array of search results
export async function GET(request: NextRequest) {

    await validateToken();

    const ACCESS_TOKEN = cookies().get("access_token")!.value
    console.log("access token: " + ACCESS_TOKEN)
    const params = new URLSearchParams(request.nextUrl.searchParams);
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

    const result: SearchResultResponse = await response.data;
    const cleaned_result = parseSearchAlbumResponse(result)

    return NextResponse.json({
        results: cleaned_result
    })
}
