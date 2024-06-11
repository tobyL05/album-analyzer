import { CircularProgress } from "@mui/material";


export default function LoadingAnalysis() {
    return(
        <div className="w-full md:w-3/4 mx-auto flex flex-col align-middle items-center p-10">
            <h1 className="text-xl mb-3">analyzing...</h1>
            <CircularProgress color="primary"/>
        </div>        
    )
}