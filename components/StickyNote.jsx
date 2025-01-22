"use client";
import { useState } from "react"
import { Pencil, X, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import RequestForm from "@/components/RequestForm"

export default function StickyNote({
  memberName,
  selectedUser
}) {
  const [requests, setRequests] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  const addRequest = (text) => {
    setRequests([
      ...requests,
      {
        id: Date.now(),
        text,
        completed: false,
        submittedBy: selectedUser,
        isCritical: false,
      },
    ])
  }

  const toggleRequest = (id) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, completed: !req.completed } : req))
    )
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    setRequests(
      requests.map((req) => (req.id === editingId ? { ...req, text: editText } : req))
    )
    setEditingId(null)
  }

  const deleteRequest = (id) => {
    setRequests(requests.filter((req) => req.id !== id))
  }

  const toggleCritical = (id) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, isCritical: !req.isCritical } : req))
    )
  }

  const pendingTasks = requests.filter((req) => !req.completed).length

  return (
    (<div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl font-semibold text-white">
          {memberName} <span className="text-sm">({pendingTasks} pending)</span>
        </h2>
      </div>
      <div className="p-4">
        <ul className="space-y-2 mb-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className={`flex items-center gap-2 p-2 rounded ${request.isCritical ? "bg-red-100" : "bg-gray-50"}`}>
              {editingId === request.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    saveEdit()
                  }}
                  className="flex-1 flex gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1" />
                  <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                    <Check className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer ${request.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                    onClick={() => toggleRequest(request.id)}>
                    {request.text} <span className="text-xs text-gray-500">({request.submittedBy})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={request.isCritical}
                      onCheckedChange={() => toggleCritical(request.id)}
                      size="sm" />
                    <AlertTriangle
                      className={`h-4 w-4 ${request.isCritical ? "text-red-500" : "text-gray-300"}`} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(request.id, request.text)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteRequest(request.id)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <RequestForm onAddRequest={addRequest} selectedUser={selectedUser} />
      </div>
    </div>)
  );
}

