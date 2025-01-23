"use client";
import { useState, useEffect } from "react"
import Board from "../../components/Board"
import NewNoteForm from "../../components/NewNoteForm"
import UserSelector from "../../components/UserSelector"
import BoardSelector from "../../components/BoardSelector"
import { Card, CardContent } from "../../components/ui/card"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from "next/link"

import { Info, LogOut } from "lucide-react"
import { db } from "../../lib/firebase"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, setDoc, arrayUnion, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'
import { useSessionData } from "../../hooks/useSessionData";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const { user } = useSessionData();

  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState("")
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    if(!user?.email) return
    fetchBoards()
  }, [user])

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

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: true, 
        callbackUrl: '/login' 
      });
      redirect('/login')
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const saveSelectedBoardToLocalStorage = (board) => {
    localStorage.setItem("selectedBoard", board)
  }

  const fetchBoards = async () => {
    const boardsList = await getBoardsList()
    const savedBoard = localStorage.getItem("selectedBoard")
    if (savedBoard) {
      const currentBoard = boardsList.find((b) => b.id === savedBoard)
      if (currentBoard) {
        const boardsRef = collection(db, "boards")
        const boardDoc = await getDoc(doc(boardsRef, currentBoard.id))
        setSelectedBoard(boardDoc.data())
        fetchTasks(boardDoc.data().id)
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
        setTaskList([])
        console.log('No tasks document found for boardId:', boardId)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  const getBoardsList = async () => {
    if (!user?.email) {
      console.log('No user or user email available');
      return [];
    }
    const userId = user.email
    try {
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        // Assuming the user document has a 'boards' field with an array of board references
        return userData.boards || []
      } else {
        console.warn(`No user document found for email: ${userId}`)
        return []
      }
    } catch (error) {
      console.error("Error fetching user's boards:", error)
      return []
    }
  }

  const createNewBoard = async (boardName) => {
    if (boardName && !boards.some(board => board.name === boardName)) {
      try {
        const boardId = uuidv4()
        const newBoard = {
          id: boardId,
          name: boardName,
          createdAt: new Date().toISOString(),
          members: [{id: user?.email, name: user?.name}],
          createdBy: user?.email,
        }

        const boardsRef = collection(db, "boards")
        await setDoc(doc(boardsRef, boardId), newBoard)

        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", user.email))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          const userData = userDoc.data()
          await updateDoc(userDoc.ref, {
            boards: arrayUnion({ id: boardId, name: boardName })
          })
        }

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

  const handleSelectBoard = async (board) => {
    const boardRef = doc(db, "boards", board)
    const boardDoc = await getDoc(boardRef)
    if (!boardDoc.exists()) {
      throw new Error("Board document not found")
    }
    const boardData = boardDoc.data()
    if (boardData) {
      setSelectedBoard(boardData)
      fetchTasks(boardData.id)
      saveSelectedBoardToLocalStorage(boardData.id)
    }
  }

  const onSaveUserToBoard = async (newUser) => {
    try {
      const boardsRef = collection(db, "boards")
      const q = query(boardsRef, where("id", "==", selectedBoard.id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const boardDoc = querySnapshot.docs[0]
        const boardData = boardDoc.data()
        
        const existingMembers = boardData.members || []
        const userExists = existingMembers.some(member => member.id === newUser.id)

        // Add board to user's boards if not already added
        const userRef = doc(db, "users", newUser.id)
        const userDoc = await getDoc(userRef)
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            name: newUser.name,
            email: newUser.email,
            boards: [{id: board, name: board}]
          })
        }
        
        if (!userExists) {
          const updatedMembers = [...existingMembers, {id: newUser.email, name: newUser.name}]
          
          await updateDoc(boardDoc.ref, { 
            members: updatedMembers 
          })
          
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

      if (!user || !user.id) {
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

  const renderLoginArea = () => {
    if (!user) {
      return null
    }

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button 
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 mr-8 rounded-full border-2 border-emerald-500 hover:ring-2 hover:ring-emerald-300 transition-all"
          >
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 min-w-[200px] transition-colors duration-300"
            sideOffset={5}
          >
            <DropdownMenu.Item 
              className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md cursor-pointer text-slate-900 dark:text-slate-200 transition-colors"
              onSelect={handleLogout}
            >
              Hello, {user.name}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1" />
            <DropdownMenu.Item 
              className="flex items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-md cursor-pointer text-red-500 transition-colors"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenu.Item>
            <DropdownMenu.Arrow className="fill-slate-200 dark:fill-slate-700" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">Team Task</h1>{/* Updated title color */}
          <div className="flex items-center gap-4">
            <BoardSelector
              boards={boards}
              selectedBoard={selectedBoard}
              onSelectBoard={handleSelectBoard}
              onCreateBoard={createNewBoard}
            />
            <UserSelector
              onSaveUserToBoard={onSaveUserToBoard}
              currentMembersIds={selectedBoard?.members?.map(member => member.id) || []}
              isDisabled={!selectedBoard?.id}
            />
            {renderLoginArea()}
          </div>
        </div>
        {!selectedBoard?.id && (
          <Card className="mb-8 bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 transition-colors duration-300 mt-8">
            <CardContent className="flex items-center p-4">
              <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-colors duration-300 mr-2" />
              <p className="text-yellow-800 dark:text-yellow-200 transition-colors duration-300">Please select the board to start working.</p>
            </CardContent>
          </Card>
        )}
        <div className="mt-8">
          <Board
            teamMembers={teamMembers}
            selectedUser={user}
            onSaveTask={saveTaskInTaskCollectionWhereCollectionIdIsBoardId}
            taskList={taskList}
            onUpdateTask={onUpdateTask}
          />
        </div>
      </div>
    </main>
  );
}