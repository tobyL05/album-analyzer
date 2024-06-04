"use server"

import { cookies } from "next/headers";
import { getAccessToken } from "../api/v1/auth/route";

function hasAccessToken() {
    return cookies().has("access_token");
}

export async function validateToken() {
    if (!hasAccessToken()) {
        const token = await getAccessToken();
        cookies().set("access_token", token, { maxAge: 3600 });
    }
}

