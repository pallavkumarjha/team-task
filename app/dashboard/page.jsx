"use client";
import { useState, useEffect } from "react"
import Board from "@/components/Board"
import NewNoteForm from "@/components/NewNoteForm"
import UserSelector from "@/components/UserSelector"
import BoardSelector from "@/components/BoardSelector"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, setDoc, arrayUnion, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState("")
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    fetchBoards()
  }, [])

  useEffect(() => {
    if (selectedBoard) {
      const members = selectedBoard.members || []
      setTeamMembers(members)
      const currentUser = members.find((member) => member.id === localStorage.getItem("selectedUser"))
      if (currentUser) {
        setSelectedUser(currentUser)
      }
    }
  }, [selectedBoard])

  const saveSelectedBoardToLocalStorage = (board) => {
    localStorage.setItem("selectedBoard", board)
  }

  const addTeamMember = (name) => {
    const userId = uuidv4()
      
    const newUser = {
      id: userId,
      name: name,
      joinedAt: new Date().toISOString(),
      role: 'member',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    }
    setTeamMembers([...teamMembers, newUser])
    onSaveUserToBoard(newUser)
  }

  const fetchBoards = async () => {
    const boardsList = await getBoardsList()
    const savedBoard = localStorage.getItem("selectedBoard")
    if (savedBoard) {
      const currentBoard = boardsList.find((b) => b.id === savedBoard)
      if (currentBoard) {
        setSelectedBoard(currentBoard)
        const boardsRef = collection(db, "boards")
        const q = query(boardsRef, where("id", "==", savedBoard))
        const querySnapshot = await getDocs(q)
  
        if (querySnapshot.empty) {
          throw new Error("Board document not found")
        }
  
        const boardDocumentId = querySnapshot.docs[0].id

        fetchTasks(boardDocumentId)
      }
    }
    setBoards(boardsList)
  }

  const fetchTasks = async (boardId) => {
    try {
      const tasksRef = doc(collection(db, "tasks"), boardId)
      const tasksSnapshot = await getDoc(tasksRef)
      
      if (tasksSnapshot.exists()) {
        const tasksData = tasksSnapshot.data()
        setTaskList(tasksData)
      } else {
        console.log('No tasks document found for boardId:', boardId)
        return []
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  const getBoardsList = async () => {
    const boardsRef = collection(db, "boards")
    const q = query(boardsRef)
    const querySnapshot = await getDocs(q)
    const boardsList = []
    querySnapshot.forEach((doc) => {
      boardsList.push(doc.data())
    })
    return boardsList
  }

  const createNewBoard = async (boardName) => {
    if (boardName && !boards.some(board => board.name === boardName)) {
      try {
        const boardId = uuidv4()
        const newBoard = {
          id: boardId,
          name: boardName,
          createdAt: new Date().toISOString(),
          members: [],
          // You can add more board-specific fields here
        }

        const boardsRef = collection(db, "boards")
        const docRef = await addDoc(boardsRef, newBoard)

        // Update local state
        const updatedBoards = [...boards, { ...newBoard }]
        setBoards(updatedBoards)
        setSelectedBoard({ ...newBoard })
        saveSelectedBoardToLocalStorage({ ...newBoard })
      } catch (error) {
        console.error("Error creating board:", error)
        alert("Failed to create board. Please try again.")
      }
    } else {
      alert(`Board "${boardName}" already exists`)
    }
  }

  const deleteTeamMember = (name) => {
    setTeamMembers(teamMembers.filter((member) => member !== name))
    if (selectedUser === name) {
      setSelectedUser("")
      localStorage.removeItem("selectedUser")
    }
  }

  const handleSelectUser = (user) => {
    const currentUser = teamMembers.find((member) => member.id === user)
    if (currentUser) {
      setSelectedUser(currentUser)
    }
    localStorage.setItem("selectedUser", user)
  }

  const handleSelectBoard = (board) => {
    const currentBoard = boards.find((b) => b.id === board)
    if (currentBoard) {
      setSelectedBoard(currentBoard)
      setSelectedUser()
      saveSelectedBoardToLocalStorage(board)
    }
  }

  const onSaveUserToBoard = async (newUser) => {
    try {
      const boardsRef = collection(db, "boards")
      const q = query(boardsRef, where("name", "==", selectedBoard.name))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const boardDoc = querySnapshot.docs[0]
        const boardData = boardDoc.data()
        
        const existingMembers = boardData.members || []
        const userExists = existingMembers.some(member => member.name === newUser.name)
        
        if (!userExists) {
          const updatedMembers = [...existingMembers, newUser]
          
          await updateDoc(boardDoc.ref, { 
            members: updatedMembers 
          })
        }
      }
    } catch (error) {
      console.error("Error saving user to board:", error)
      alert("Failed to add user to the board")
    }
  }

  const saveTaskInTaskCollectionWhereCollectionIdIsBoardId = async (task) => {
    try {
      if (!selectedBoard || !selectedBoard.id) {
        throw new Error("No board selected")
      }

      if (!selectedUser || !selectedUser.id) {
        throw new Error("No user selected")
      }

      const boardsRef = collection(db, "boards")
      const q = query(boardsRef, where("id", "==", selectedBoard.id))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error("Board document not found")
      }

      const boardDocumentId = querySnapshot.docs[0].id

      const taskToSave = {
        ...task,
        boardId: selectedBoard.id,
        boardDocumentId: boardDocumentId,
        boardName: selectedBoard.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      }

      const tasksRef = doc(collection(db, "tasks"), boardDocumentId)
      const currentTasks = (await getDoc(tasksRef)).data() || {}

      const userTasks = currentTasks[task.metadata.toId] || []
      const existingTaskIndex = userTasks.findIndex(existingTask => existingTask.id === task.id)

      if (existingTaskIndex !== -1) {
        // Update existing task
        userTasks[existingTaskIndex] = { ...userTasks[existingTaskIndex], ...taskToSave }
      } else {
        // Add new task
        userTasks.push(taskToSave)
      }

      await setDoc(tasksRef, {
        [task.metadata.toId]: userTasks
      }, { merge: true })

      return {
        ...taskToSave,
        firestoreId: boardDocumentId
      }
    } catch (error) {
      console.error("Error saving task:", error)
      alert(error.message || "Failed to save task")
      return null
    }
  }

  const onUpdateTask = async (task) => {
    try {
      const updatedTask = await saveTaskInTaskCollectionWhereCollectionIdIsBoardId(task)

      if (updatedTask) {
        setTaskList((prevTasks) => {
          const updatedTasks = { ...prevTasks }
          updatedTasks[task.metadata.toId] = updatedTasks[task.metadata.toId]?.map((t) => {
            if (t.id === task.id) {
              return updatedTask
            } else {
              return t
            }
          })
          return updatedTasks
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert(error.message || "Failed to update task")
    }
  }

  return (
    (<main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">Team Task</h1>
          <div className="flex items-center gap-4">
            <BoardSelector
              boards={boards}
              selectedBoard={selectedBoard}
              onSelectBoard={handleSelectBoard}
              onCreateBoard={createNewBoard}
            />
            <NewNoteForm onAddMember={addTeamMember} />
            <UserSelector
              users={teamMembers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
            />
          </div>
        </div>
        {!selectedUser?.id && (
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
          onDeleteMember={deleteTeamMember}
          onSaveTask={saveTaskInTaskCollectionWhereCollectionIdIsBoardId}
          taskList={taskList}
          onUpdateTask={onUpdateTask}
        />
      </div>
    </main>)
  );
}
