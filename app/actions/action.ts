"use server"

import { cookies } from "next/headers";
import axios from "axios";
import { AccessTokenResponse } from "@/shared/types";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function fetchAccessToken() {
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
    const resp: AccessTokenResponse = await req.data;
    return resp;
}

async function getAccessToken() {
    const resp: AccessTokenResponse = await fetchAccessToken()
    return resp.access_token;
}

function hasAccessToken() {
    return cookies().has("access_token");
}

export async function validateToken() {
    if (!hasAccessToken()) {
        const token = await getAccessToken();
        cookies().set("access_token", token, { maxAge: 3600 });
    }
}

