import { NewReleases } from "@/shared/types";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/app/actions/action";

export async function GET(request: NextRequest) {

    await validateToken()

    const ACCESS_TOKEN = cookies().get("access_token")?.value
    const getNewReleasesReq = await axios.get("https://api.spotify.com/v1/browse/new-releases?limit=5",{
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })
    const getNewReleasesResp: NewReleases = await getNewReleasesReq.data;
    return NextResponse.json(getNewReleasesResp);
}

export const dynamic = 'force-dynamic'