import Analysis from "@/components/Analysis";
import Search from "@/components/Search";
import LoadingAnalysis from "@/components/ui/LoadingAnalysis";
import { Suspense } from "react";
import AlbumMarquee from "@/components/ui/AlbumMarquee";
import { Home } from 'lucide-react'

interface searchParams {
  searchParams? : { [key: string]: string }
}

export default function Main( { searchParams }: searchParams) {
  
  const album_id: string = searchParams?.album_id ?? "";

  return (
    <>
      <div className="w-full p-10 md:p-20 bg-background mt-10 flex flex-col items-center">
        <div className="w-full md:w-2/3 mx-auto mb-3 flex flex-row justify-between items-end">
          <h1 className="font-bold text-2xl md:text-3xl p-3 self-start">analyze your favorite albums!</h1> 
          <a href="/"><Home className="p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-primary hover:text-white hover:bg-opacity-" strokeWidth={2} size={48}/></a>
        </div>
        <Search className="w-full md:w-2/3 rounded-xl bg-white shadow-lg shadow-primary border-[1px] border-black"/>
      </div>

      {album_id ? null : 
      <div className="w-full md:w-2/3 mx-auto mt-3 p-10">
        <h1 className="text-2xl font-semibold mb-3">or any of these new releases...</h1>
        <AlbumMarquee/>
      </div>}

      {album_id ?  
        <Suspense fallback={<LoadingAnalysis/>}>
            <Analysis className="w-full mx-auto mt-3 p-8" album_id={album_id}/>
            <h1 className="p-4 text-center">made by tobs | © 2024</h1>
        </Suspense> 
        : null }

      {album_id ? null : <div className={"w-full absolute bottom-0"}>
        <h1 className="p-4 text-center">made by tobs | © 2024</h1>
      </div>}
    </>
  );
}
