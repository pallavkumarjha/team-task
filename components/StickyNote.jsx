"use client";
import { useEffect, useState } from "react"
import { Pencil, X, Check, AlertTriangle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import RequestForm from "../components/RequestForm"
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
      ...existingRequest,
      isCompleted: !existingRequest.isCompleted
    }
    onUpdateTask(payload)
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    const existingRequest = requests.find((req) => req.id === editingId)
    if (!existingRequest) {
      return
    }

    setRequests(
      requests?.map((req) => (req.id === editingId ? { ...req, task: editText } : req))
    )
    
    const payload = {
      ...existingRequest,
      task: editText,
    }
    onUpdateTask(payload)

    setEditingId(null)
  }

  const deleteRequest = (id) => {
    const existingRequest = requests.find((req) => req.id === id)
    if (!existingRequest) {
      return
    }
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isActive: !req.isActive } : req))
    )
    const payload = {
      ...existingRequest,
      isActive: !existingRequest.isActive,
    }
    onUpdateTask(payload)
  }

  const toggleCritical = (id) => {

    const existingRequest = requests.find((req) => req.id === id)
    if (!existingRequest) {
      return
    }
    setRequests(
      requests?.map((req) => (req.id === id ? { ...req, isCritical: !req.isCritical } : req))
    )
    const payload = {
      ...existingRequest,
      isCritical: !existingRequest.isCritical,
    }
    onUpdateTask(payload)
  }

  const pendingTasks = requests.filter((req) => !req.isCompleted && req.isActive).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-300"> {/* Added dark mode bg, border, and transition */}
      <div className="bg-emerald-500 dark:bg-emerald-600 p-4 transition-colors duration-300"> {/* Emerald header */}
        <h2 className="text-xl font-semibold text-white transition-colors duration-300">
          {memberName} <span className="text-sm text-slate-100 dark:text-slate-300 transition-colors duration-300">({pendingTasks} pending)</span>{/*Updated pending tasks color*/}
        </h2>
      </div>
      <div className="p-4">
        <ul className="space-y-2 mb-4">
          {requests?.map((request) => (
            <li
              key={request.id}
              className={`flex items-center gap-2 p-2 rounded transition-colors duration-300 ${request.isCritical ? "bg-red-100 dark:bg-red-900" : "bg-slate-100 dark:bg-slate-700"} ${request.isActive === false ? "hidden" : ""}`}> {/* Updated background colors */}
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
                    className="flex-1 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200" /> {/* Input styling */}
                  <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white"> {/* Updated button color */}
                    <Check className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer transition-colors duration-300 ${request.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`} // Updated text colors
                    onClick={() => toggleRequest(request.id)}>
                    {request.task} <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">({request.metadata.fromName})</span> {/* Updated name color */}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={request.isCritical}
                      onCheckedChange={() => toggleCritical(request.id)}
                      size="sm" />
                    <AlertTriangle
                      className={`h-4 w-4 transition-colors duration-300 ${request.isCritical ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`} /> {/* Updated icon colors */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-500 dark:text-emerald-400 transition-colors duration-300"
                      onClick={() => startEdit(request.id, request.task)}> {/* Updated button text color */}
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 transition-colors duration-300" onClick={() => deleteRequest(request.id)}> {/* Updated button text color */}
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <RequestForm onAddRequest={addRequest} selectedUser={selectedUser} />
      </div>
    </div>
  );
}