"use client";
import { useEffect, useState, useRef } from "react"
import { Pencil, X, Check, Loader2, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import RequestForm from "../components/RequestForm"
import { v4 as uuidv4 } from 'uuid'
import RemoveUserDialog from "../components/RemoveUserDialog"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState(false)
  const noteRef = useRef(null)

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
    <div 
      ref={noteRef}
      className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-in-out transform hover:border-emerald-300/50 dark:hover:border-emerald-600/50 flex flex-col"
      style={{
        height: 'fit-content',
        minHeight: '200px',
        maxHeight: '600px'
      }}
    >
      {isLoadingTasks ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 p-6 transition-all duration-300 flex justify-between items-center shadow-md">
            <h2 className="text-xl font-bold text-white transition-all duration-300 flex items-center gap-3 group">
              {memberName} 
              <span className="text-sm font-medium px-3 py-1 bg-white/30 rounded-full text-white group-hover:bg-white/40 transition-all duration-300">
                {pendingTasks} pending
              </span>
            </h2>
            {onRemoveUser && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/90 hover:text-white hover:bg-white/30 transition-all duration-300 rounded-lg"
                  onClick={() => setIsRemoveUserDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <RemoveUserDialog
                  isOpen={isRemoveUserDialogOpen}
                  onClose={() => setIsRemoveUserDialogOpen(false)}
                  onConfirm={() => {
                    onRemoveUser({ id: memberId, name: memberName })
                    setIsRemoveUserDialogOpen(false)
                  }}
                  userName={memberName}
                />
              </>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16, 185, 129, 0.5) transparent' }}>
            <ul className="space-y-4">
              {requests?.map((request) => (
                <li
                  key={request.id}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${request.isCritical ? "bg-red-100/90 dark:bg-red-900/40 border border-red-200 dark:border-red-800 shadow-red-500/10" : "bg-slate-100/90 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 shadow-slate-500/10"} ${request.isActive === false ? "hidden" : ""} hover:shadow-lg hover:translate-y-[-2px]`}>
                  {editingId === request.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveEdit()
                      }}
                      className="flex-1 flex gap-3">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 bg-white/90 dark:bg-slate-800/90 border border-slate-300/50 dark:border-slate-500/50 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300" />
                      <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                        <Check className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div
                        className={`flex-1 transition-all duration-300 ${request.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"} flex items-center gap-2 min-w-0`}>
                        <span
                          className="cursor-pointer whitespace-pre-wrap break-words"
                          style={{
                            maxWidth: 'calc(100% - 1rem)'
                          }}
                          onClick={() => toggleRequest(request.id)}>
                          {request.task}
                          <span className="ml-4 inline-flex items-center shrink-0 px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-600/70 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-300/70 dark:hover:bg-slate-500/70 text-xs">
                          {request.metadata.fromName}
                        </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 rounded-lg flex items-center gap-1"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
                              </svg>
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                          <DropdownMenu.Content className="w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-1.5 animate-in fade-in-0 zoom-in-95">
                            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Critical</span>
                                <Switch
                                  checked={request.isCritical}
                                  onCheckedChange={() => toggleCritical(request.id)}
                                  size="sm"
                                  className="data-[state=checked]:bg-red-500 transition-all duration-300"
                                />
                              </div>
                            </div>
                            <DropdownMenu.Item
                              onClick={() => startEdit(request.id, request.task)}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md cursor-pointer transition-colors duration-200 border-b border-slate-200 dark:border-slate-700"
                            >
                              <Pencil className="h-4 w-4 text-emerald-500" />
                              Edit Task
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => deleteRequest(request.id)}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md cursor-pointer transition-colors duration-200 mt-1"
                            >
                              <X className="h-4 w-4 text-red-500" />
                              Delete Task
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95">
            <RequestForm onAddRequest={addRequest} selectedUser={selectedUser} />
          </div>
        </>
      )}
    </div>
  );
}