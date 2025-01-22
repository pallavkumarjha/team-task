"use client";
import { useState, useEffect } from "react"
import Board from "@/components/Board"
import NewNoteForm from "@/components/NewNoteForm"
import UserSelector from "@/components/UserSelector"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function Home() {
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")

  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser")
    if (savedUser) {
      setSelectedUser(savedUser)
    }
  }, [])

  const addTeamMember = (name) => {
    setTeamMembers([...teamMembers, name])
  }

  const deleteTeamMember = (name) => {
    setTeamMembers(teamMembers.filter((member) => member !== name))
    if (selectedUser === name) {
      setSelectedUser("")
      localStorage.removeItem("selectedUser")
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    localStorage.setItem("selectedUser", user)
  }

  return (
    (<main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Team Board</h1>
          <div className="flex items-center gap-4">
            <NewNoteForm onAddMember={addTeamMember} />
            <UserSelector
              users={teamMembers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser} />
          </div>
        </div>
        {!selectedUser && (
          <Card className="mb-8 bg-yellow-100 border-yellow-200">
            <CardContent className="flex items-center p-4">
              <Info className="w-6 h-6 text-yellow-600 mr-2" />
              <p className="text-yellow-800">Please select your identity to interact with the board.</p>
            </CardContent>
          </Card>
        )}
        <Board
          teamMembers={teamMembers}
          selectedUser={selectedUser}
          onDeleteMember={deleteTeamMember} />
      </div>
    </main>)
  );
}

