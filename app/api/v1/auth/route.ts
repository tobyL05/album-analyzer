import axios from "axios";
import { cookies } from "next/headers";
import { accessTokenResponse } from "../search";

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
    const resp: accessTokenResponse = await req.data;
    return resp;
}

export async function getAccessToken() {
    const resp: accessTokenResponse = await fetchAccessToken()
    return resp.access_token;
}