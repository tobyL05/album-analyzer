"use client"

import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SearchButton } from "./ui/SearchButton";
import { Autocomplete, Divider, TextField, debounce } from "@mui/material";
import axios from "axios";
import Image from "next/image";

interface fetchDataResponse {
    status: number,
    results: string[]
}

type searchResult = {
    albumId: string,
    albumName: string,
    albumArtists: string[],
    albumCover: string,
}


export default function SearchComponent() {

    const [searching, setSearching] = useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<readonly searchResult[]>([])
    const delaySearch = useCallback(
        debounce((text, callback) => {
            setSearchResults([])
            // getOptionsAsync(text).then(callback);
            fetchData(text).then((resp) => {
                const results: searchResult[] = resp.results
                callback(results);
                // callback(results.map((result: searchResult) => {
                //     return result.albumName + " - " + result.albumArtists.join(", ") 
                // }))
            })
        }, 200),
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

    return (
        <div className="w-3/4 mx-auto p-10 flex items-center space-x-3 ">
            <Autocomplete
                className="w-3/4"
                freeSolo
                onInputChange={(e, newInput, reason) => {
                    setSearchInput(newInput)
                }}
                options={searchResults}
                getOptionLabel={(option: searchResult) => {
                    return option.albumName + " - " + option.albumArtists.join(", ")
                }}
                onChange={(e) => console.log("Selected " + e)}
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
                        <li {...props} key={option.albumCover} className="flex flex-row p-4">
                            <Image key={option.albumCover} src={option.albumCover} width={100} height={100} alt="album cover"/>
                            <h1 key={option.albumName}>{ option.albumName }</h1>
                            {/* {option.albumArtists.map((artist) => {
                                return <h1> { artist.name }</h1>
                            })} */}
                            <Divider variant="middle"/>
                        </li>

                    )
                }}
            />
            <SearchButton onClick={search} className="p-5 py-7 bg-primary"/>
            
            {/* <div className="flex items-center space-x-3 justify-center p-4">
                <Input type="text" placeholder="Search" className="w-1/4"/>
                <SearchButton onClick={search}/>
            </div> */}
        </div>
    )
}