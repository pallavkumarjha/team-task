"use client";
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus, Loader2 } from "lucide-react"

export default function RequestForm({
  onAddRequest,
  selectedUser,
  isCreatingTask
}) {
  const [request, setRequest] = useState("")

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedRequest = request.trim()
    if (trimmedRequest) {
      // Check if the input is a URL
      const isUrl = validateUrl(trimmedRequest)
      onAddRequest(isUrl ? `[Link] ${trimmedRequest}` : trimmedRequest)
      setRequest("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder={selectedUser 
          ? "Add a quick request or paste a link"
          : "Select a user to add requests"}
        className="flex-grow bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-300"
        disabled={!selectedUser || isCreatingTask}
      />
      <Button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-4 py-2 transition-colors duration-300"
        disabled={!selectedUser || isCreatingTask}>
        {isCreatingTask ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}