"use client"

import React, { JSX, RefAttributes, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Autocomplete, Popper, PopperProps, TextField, debounce } from "@mui/material";
import axios from "axios";
import { album } from "../shared/types";
import SearchResult from "./ui/SearchResult";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface props {
    className: string
}

export default function SearchComponent({ className }: props ) {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<readonly album[]>([])
    const delaySearch = useCallback(
        debounce((text, callback) => {
            setSearchResults([])
            // getOptionsAsync(text).then(callback);
            fetchData(text).then((resp) => {
                const results: album[] = resp.results
                callback(results);
            })
        }, 500),
        []
      );

    async function fetchData(text: string) {
        const call = await axios.get("/api/v1/search",{
            params: {
                search: text
            }
        });
        const resp = await call.data;
        // console.log(resp)
        return resp;
    }


    useEffect(() => {
        if (searchInput !== "") {
            setSearchResults([])
            delaySearch(searchInput, (results:album[]) => {
                setSearchResults([...searchResults,...results])
            })
        } else {
            setSearchResults([])
        }

    },[searchInput, delaySearch])

    function selected(event:SyntheticEvent,album:album) {
        // call api and get features
        // POST to api
        const query = new URLSearchParams(searchParams);
        query.set("album_id",album.id)
        // console.log(pathName + "?" + query.toString());
        router.push(pathName+ "?" + query.toString());

    }

    const resultsPopper = function (props: JSX.IntrinsicAttributes & PopperProps & RefAttributes<HTMLDivElement>) {
        return (<Popper {...props} className="w-inherit pt-5 rounded-full" placement='auto' />)
      }

    return (
        <>
            <Autocomplete
                className={cn(className)}
                freeSolo
                PopperComponent={resultsPopper}
                onInputChange={(e, newInput, reason) => {
                    setSearchInput(newInput)
                }}
                sx={{
                    "& fieldset": { border: 'none' },
                  }}
                options={searchResults}
                getOptionLabel={(option: album | string) => {
                    const result: album = option as album
                    return result.name + " - " + result.artists.join(", ")
                }}
                onChange={(event, value, reason) => {
                    if (reason == "selectOption") {
                        selected(event,value as album)
                    }
                }}
                loading={searchResults.length === 0}
                loadingText="Loading results..."
                noOptionsText="No albums found."
                onClose={() => setSearchResults([])}
                clearOnEscape={true}
                clearOnBlur={true}
                filterOptions={(x) => x}
                renderInput={(params) => <TextField {...params} 
                    label="" 
                    placeholder="Search for an album"/>}
                renderOption={(props, option: album) => {
                    return(
                        <li {...props}
                        key={option.id}
                        className="flex flex-row m-4 p-4 items-center justify-between hover:bg-primary hover:text-white transition ease-in-out duration-300 rounded-lg cursor-pointer"> 
                            <SearchResult album={option} />
                        </li>
                    )
                }}
            />
        
        </>
    )
}