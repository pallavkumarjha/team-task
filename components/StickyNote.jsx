"use client";
import { useEffect, useState } from "react"
import { Pencil, X, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import RequestForm from "@/components/RequestForm"
import { v4 as uuidv4 } from 'uuid'

export default function StickyNote({
  memberName,
  memberId,
  selectedUser,
  onSaveTask,
  tasks = [],
  onUpdateTask
}) {
  const [requests, setRequests] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    setRequests(tasks)
  }, [tasks])

  const addRequest = (text) => {
    const payload = {
      task: text,
      id: uuidv4(),
      isCritical: false,
      isCompleted: false,
      isActive: true,
      metadata: {
        fromId: selectedUser.id,
        fromName: selectedUser.name,
        toId: memberId,
        toName: memberName
      }
    }
    setRequests([
      ...requests,
      payload,
    ])
    onSaveTask(payload)
  }

  const toggleRequest = (id) => {
    const existingRequest = requests.find((req) => req.id === id)
    if (!existingRequest) {
      return
    }
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isCompleted: !req.isCompleted } : req))
    )
    const payload = {
      task: existingRequest.task,
      id: existingRequest.id,
      isCritical: false,
      isActive: true,
      isCompleted: !existingRequest.isCompleted,
      metadata: {
        fromId: selectedUser.id,
        fromName: selectedUser.name,
        toId: memberId,
        toName: memberName
      }
    }
    onUpdateTask(payload)
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    setRequests(
      requests?.map((req) => (req.id === editingId ? { ...req, text: editText } : req))
    )
    const payload = {
      task: editText,
      id: editingId,
      isCritical: false,
      isActive: true,
      isCompleted: false,
      metadata: {
        fromId: selectedUser.id,
        fromName: selectedUser.name,
        toId: memberId,
        toName: memberName
      }
    }
    onUpdateTask(payload)

    setEditingId(null)
  }

  const deleteRequest = (id) => {
    setRequests(requests.filter((req) => req.id !== id))
    const existingRequest = requests.find((req) => req.id === id)
    if (!existingRequest) {
      return
    }
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isActive: !req.isActive } : req))
    )
    const payload = {
      task: existingRequest.task,
      id: existingRequest.id,
      isActive: false,
      isCritical: false,
      isCompleted: !existingRequest.isCompleted,
      metadata: {
        fromId: selectedUser.id,
        fromName: selectedUser.name,
        toId: memberId,
        toName: memberName
      }
    }
    onUpdateTask(payload)
  }

  const toggleCritical = (id) => {
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isCritical: !req.isCritical } : req))
    )

    const existingRequest = requests.find((req) => req.id === id)
    if (!existingRequest) {
      return
    }
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isCritical: !req.isCritical } : req))
    )
    const payload = {
      task: existingRequest.task,
      id: existingRequest.id,
      isActive: true,
      isCritical: !existingRequest.isCritical,
      isCompleted: existingRequest.isCompleted,
      metadata: {
        fromId: selectedUser.id,
        fromName: selectedUser.name,
        toId: memberId,
        toName: memberName
      }
    }
    onUpdateTask(payload)
  }

  const pendingTasks = requests.filter((req) => !req.isCompleted).length

  return (
    (<div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl font-semibold text-white">
          {memberName} <span className="text-sm">({pendingTasks} pending)</span>
        </h2>
      </div>
      <div className="p-4">
        <ul className="space-y-2 mb-4">
          {requests?.map((request) => (
            <li
              key={request.id}
              className={`flex items-center gap-2 p-2 rounded ${request.isCritical ? "bg-red-100" : "bg-gray-50"} ${request.isActive === false ? "hidden" : ""}`}>
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
                    className={`flex-1 cursor-pointer ${request.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
                    onClick={() => toggleRequest(request.id)}>
                    {request.task} <span className="text-xs text-gray-500">({request.metadata.fromName})</span>
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
                      onClick={() => startEdit(request.id, request.task)}>
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

