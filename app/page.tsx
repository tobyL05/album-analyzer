import Analysis from "@/components/Analysis";
import Search from "@/components/Search";
import { Suspense } from "react";

interface searchParams {
  searchParams? : { [key: string]: string }
}

export default function Main( { searchParams }: searchParams) {
  
  const album_id: string = searchParams?.album_id ?? "";

  return (
    <>
      <div className="w-full p-10 md:p-20 bg-background mt-10 flex flex-col items-center">
        <h1 className="w-full md:w-2/3 mx-auto text-left font-bold text-3xl m-3 self-start">analyze your favorite albums!</h1> 
        <Search className="w-full md:w-2/3 rounded-xl bg-white shadow-lg shadow-primary border-[1px] border-black"/>
      </div>

      <div className="w-full mt-5 p-10">
        <Suspense fallback={<h1>Loading</h1>}>
          <Analysis className="w-full mx-auto" album_id={album_id}/>
        </Suspense>
      </div>

    </>
  );
}
