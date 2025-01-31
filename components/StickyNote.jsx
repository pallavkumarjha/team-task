"use client";
import { useEffect, useState, useRef } from "react"
import { Pencil, X, Check, AlertTriangle, Loader2, Trash2 } from "lucide-react"
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
  onUpdateTask,
  isLoadingTasks = false,
  onRemoveUser
}) {
  const [requests, setRequests] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const noteRef = useRef(null)

  useEffect(() => {
    // Reset requests when tasks change
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
    <div 
      ref={noteRef}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-300"
      style={{
        minHeight: '300px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      {isLoadingTasks ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          <div className="bg-emerald-500 dark:bg-emerald-600 p-4 transition-colors duration-300 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white transition-colors duration-300">
              {memberName} <span className="text-sm text-slate-100 dark:text-slate-300 transition-colors duration-300">({pendingTasks} pending)</span>
            </h2>
            {onRemoveUser && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:bg-red-100 transition-colors duration-300"
                onClick={() => onRemoveUser({ id: memberId, name: memberName })}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
          <div className="p-4">
            <ul className="space-y-2 mb-4">
              {requests?.map((request) => (
                <li
                  key={request.id}
                  className={`flex items-center gap-2 p-2 rounded transition-colors duration-300 ${request.isCritical ? "bg-red-100 dark:bg-red-900" : "bg-slate-100 dark:bg-slate-700"} ${request.isActive === false ? "hidden" : ""}`}>
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
                        className="flex-1 bg-slate-50 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200" />
                      <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Check className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span
                        className={`flex-1 cursor-pointer transition-colors duration-300 ${request.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}
                        onClick={() => toggleRequest(request.id)}>
                        {request.task} <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">({request.metadata.fromName})</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={request.isCritical}
                          onCheckedChange={() => toggleCritical(request.id)}
                          size="sm" />
                        <AlertTriangle
                          className={`h-4 w-4 transition-colors duration-300 ${request.isCritical ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-500 dark:text-emerald-400 transition-colors duration-300"
                          onClick={() => startEdit(request.id, request.task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 transition-colors duration-300" onClick={() => deleteRequest(request.id)}>
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
        </>
      )}
    </div>
  );
}