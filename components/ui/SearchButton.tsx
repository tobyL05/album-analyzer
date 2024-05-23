
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

type props = {
    className?: string
    // children: React.ReactNode
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export function SearchButton({ className, onClick }: props) {
  return (
    <Button className={cn(className)} onClick={onClick}>
      <Search className="mr-2 h-4 w-4" /> Search
    </Button>
  )
}
