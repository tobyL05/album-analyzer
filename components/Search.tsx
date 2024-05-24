"use client"

import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SearchButton } from "./ui/SearchButton";
import { Autocomplete, Divider, TextField, debounce } from "@mui/material";
import axios from "axios";
import Image from "next/image";

type searchResult = {
    albumId: string,
    albumName: string,
    albumArtists: string[],
    albumCover: string,
    albumRelease: string
}




export default function SearchComponent() {

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<readonly searchResult[]>([])
    const delaySearch = useCallback(
        debounce((text, callback) => {
            setSearchResults([])
            // getOptionsAsync(text).then(callback);
            fetchData(text).then((resp) => {
                const results: searchResult[] = resp.results
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

    function search(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error("Function not implemented.")
    }

    useEffect(() => {
        if (searchInput !== "") {
            setSearchResults([])
            delaySearch(searchInput, (results:searchResult[]) => {
                setSearchResults([...searchResults,...results])
            })
        } else {
            setSearchResults([])
        }

    },[searchInput, delaySearch])

    function selected(event:SyntheticEvent,value:searchResult) {
        console.log(value.albumName);
    }

    return (
        <div className="w-full mx-auto p-10 flex items-center space-x-3 ">
            <Autocomplete
                className="w-full"
                freeSolo
                onInputChange={(e, newInput, reason) => {
                    setSearchInput(newInput)
                }}
                options={searchResults}
                getOptionLabel={(option: searchResult | string) => {
                    const result: searchResult = option as searchResult
                    return result.albumName + " - " + result.albumArtists.join(", ")
                }}
                onChange={(event, value) => selected(event,value as searchResult)}
                loading={searchResults.length === 0}
                loadingText="Loading results..."
                noOptionsText="No albums found."
                onClose={() => setSearchResults([])}
                clearOnEscape={true}
                clearOnBlur={true}
                filterOptions={(x) => x}
                renderInput={(params) => <TextField {...params} label="" placeholder="Search for an album"/>}
                renderOption={(props, option: searchResult) => {
                    return(
                        <li {...props} className="flex flex-row p-4 space-x-3 items-center">
                            <Image key={option.albumCover} src={option.albumCover} width={64} height={64} alt="album cover"/>
                            <div className="">
                                <h1 key={option.albumName} className="font-2xl w-3/4">{ option.albumName }</h1>
                                <h1>{ option.albumArtists.join(", ") }</h1>
                            </div>
                            <h1 key={option.albumRelease} className="font-2xl w-1/4">({ option.albumRelease })</h1>
                        </li>

                    )
                }}
            />
            {/* <SearchButton onClick={search} className="p-5 py-7 bg-primary"/> */}
            
            {/* <div className="flex items-center space-x-3 justify-center p-4">
                <Input type="text" placeholder="Search" className="w-1/4"/>
                <SearchButton onClick={search}/>
            </div> */}
        </div>
    )
}