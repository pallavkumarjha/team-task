import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Button } from "./ui/button"

export default function BoardSelector({
    boards,
    selectedBoard,
    onSelectBoard,
    onCreateBoard
  }) {
    return (
      <div className="flex items-center space-x-2">
         <Button 
          variant="outline"
          onClick={() => {
            const boardName = prompt("Enter the name of the new board:");
            if (boardName && boardName.trim()) {
              onCreateBoard(boardName.trim());
            }
          }}
        >
         Create board +
        </Button>
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