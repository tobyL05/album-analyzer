import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const params = new URLSearchParams(request.nextUrl.searchParams);
    // const album_id: string = params.get("albumi")
    console.log(params.get("album_id"));
    
    return NextResponse.json({
        status: 400
    })
}