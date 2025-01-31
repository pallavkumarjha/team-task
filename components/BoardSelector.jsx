import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"

export default function BoardSelector({
    boards,
    selectedBoard,
    onSelectBoard
  }) {
    return (
      <div className="flex items-center space-x-2">
        <Select 
          value={selectedBoard?.id || ''} 
          onValueChange={onSelectBoard}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select board" />
          </SelectTrigger>
          <SelectContent>
            {boards?.map((board) => (
              <SelectItem
                value={board.id}
                key={board.id}
              >
                {board.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }