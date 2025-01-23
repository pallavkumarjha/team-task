"use client";
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus } from "lucide-react"

export default function RequestForm({
  onAddRequest,
  selectedUser
}) {
  const [request, setRequest] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (request.trim()) {
      onAddRequest(request.trim())
      setRequest("")
    }
  }

  return (
    (<form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder={selectedUser ? "Add a quick request" : "Select a user to add requests"}
        className="flex-grow"
        disabled={!selectedUser} />
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700"
        disabled={!selectedUser}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>)
  );
}

