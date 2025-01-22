"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"

export default function NewNoteForm({
  onAddMember
}) {
  const [name, setName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onAddMember(name.trim())
      setName("")
    }
  }

  return (
    (<form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add member"
        className="w-40" />
      <Button type="submit" size="icon" className="bg-green-400 hover:bg-green-500">
        <UserPlus className="h-4 w-4" />
      </Button>
    </form>)
  );
}

