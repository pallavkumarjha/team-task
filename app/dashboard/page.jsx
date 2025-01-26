"use client";
import { useState, useEffect } from "react"
import Board from "../../components/Board"
import NewNoteForm from "../../components/NewNoteForm"
import UserSelector from "../../components/UserSelector"
import BoardSelector from "../../components/BoardSelector"
import { Card, CardContent } from "../../components/ui/card"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from "next/link"

import { Delete, DeleteIcon, Info, LogOut, Trash2 } from "lucide-react"
import { db } from "../../lib/firebase"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, setDoc, arrayUnion, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'
import { useSessionData } from "../../hooks/useSessionData";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/Header";

export default function Dashboard() {
  const { user } = useSessionData();

  const [teamMembers, setTeamMembers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState("")
  const [taskList, setTaskList] = useState({})
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isAddingUserToBoard, setIsAddingUserToBoard] = useState(false)
  const [isRemovingUser, setIsRemovingUser] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)

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
        // Ensure taskList matches the structure used in onUpdateTask
        setTaskList(tasksData)
      } else {
        setTaskList({})
        console.log('No tasks document found for boardId:', boardId)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTaskList({})
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
      setIsCreatingBoard(true)
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
        
        // Fetch the newly created board's full data
        const boardDocRef = doc(db, "boards", boardId)
        const boardDoc = await getDoc(boardDocRef)
        if (boardDoc.exists()) {
          const fullBoardData = boardDoc.data()
          setSelectedBoard(fullBoardData)
          saveSelectedBoardToLocalStorage(fullBoardData.id)
          
          // Fetch tasks for the new board
          await fetchTasks(boardId)
        }
      } catch (error) {
        console.error("Error creating board:", error)
        alert("Failed to create board. Please try again.")
      } finally {
        setIsCreatingBoard(false)
      }
    } else {
      alert(`Board "${boardName}" already exists`)
    }
  }

  const handleSelectBoard = async (board) => {
    setIsLoadingTasks(true)
    try {
      const boardRef = doc(db, "boards", board)
      const boardDoc = await getDoc(boardRef)
      if (!boardDoc.exists()) {
        throw new Error("Board document not found")
      }
      const boardData = boardDoc.data()
      if (boardData) {
        setSelectedBoard(boardData)
        await fetchTasks(boardData.id)
        saveSelectedBoardToLocalStorage(boardData.id)
      }
    } catch (error) {
      console.error("Error selecting board:", error)
      alert("Failed to select board")
    } finally {
      setIsLoadingTasks(false)
    }
  }

  const onSaveUserToBoard = async (newUser) => {
    setIsAddingUserToBoard(true)
    try {
      const boardsRef = collection(db, "boards")
      const q = query(boardsRef, where("id", "==", selectedBoard.id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const boardDoc = querySnapshot.docs[0]
        const boardData = boardDoc.data()
        
        const existingMembers = boardData.members || []
        const userExists = existingMembers.some(member => member.id === newUser.id)
        if (!userExists) {
          await updateDoc(boardDoc.ref, {
            members: arrayUnion({ id: newUser.id, name: newUser.name })
          })
          
          // Update local state to reflect new member
          setSelectedBoard(prevBoard => ({
            ...prevBoard,
            members: [...(prevBoard.members || []), { id: newUser.id, name: newUser.name }]
          }))
        }

        const userRef = doc(db, "users", newUser.id)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          console.log("User doesn't exist")
        } else {
          const userData = userDoc.data()
          const existingBoards = userData.boards || []
          const boardExists = existingBoards.some(b => b.id === selectedBoard.id)
          
          if (!boardExists) {
            await updateDoc(userRef, {
              boards: arrayUnion({ id: selectedBoard.id, name: selectedBoard.name })
            })
          }
        }
      }
    } catch (error) {
      console.error("Error saving user to board:", error)
      alert("Failed to add user to the board")
    } finally {
      setIsAddingUserToBoard(false)
    }
  }

  const removeUserFromBoard = async (userToRemove) => {
    // Confirm before removing
    const confirmRemove = window.confirm(`Are you sure you want to remove ${userToRemove.name} from this board?`)
    
    if (!confirmRemove) return

    setIsRemovingUser(true)
    try {
      if (!selectedBoard) {
        throw new Error("No board selected")
      }

      // Remove user from board's members
      const boardsRef = collection(db, "boards")
      const q = query(boardsRef, where("id", "==", selectedBoard.id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const boardDoc = querySnapshot.docs[0]
        const boardData = boardDoc.data()
        
        // Filter out the user to remove
        const updatedMembers = (boardData.members || [])
          .filter(member => member.id !== userToRemove.id)
        
        // Update board document
        await updateDoc(boardDoc.ref, {
          members: updatedMembers
        })

        // Remove board from user's boards
        const userRef = doc(db, "users", userToRemove.id)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const updatedBoards = (userData.boards || [])
            .filter(board => board.id !== selectedBoard.id)
          
          await updateDoc(userRef, {
            boards: updatedBoards
          })
        }

        // Update local state
        setSelectedBoard(prevBoard => ({
          ...prevBoard,
          members: updatedMembers
        }))

        alert(`${userToRemove.name} has been removed from the board.`)
      }
    } catch (error) {
      console.error("Error removing user from board:", error)
      alert("Failed to remove user from the board")
    } finally {
      setIsRemovingUser(false)
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
          // Create a copy of the previous tasks
          const updatedTasks = { ...prevTasks }
          
          // Find the user's tasks array
          const userTasksArray = updatedTasks[task.metadata.toId] || []
          
          // Find the index of the task to update
          const taskIndex = userTasksArray.findIndex(t => t.id === task.id)
          
          // If task found, replace it with the updated task
          if (taskIndex !== -1) {
            userTasksArray[taskIndex] = updatedTask
          }
          
          // Update the tasks for the specific user
          updatedTasks[task.metadata.toId] = userTasksArray
          
          return updatedTasks
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert(error.message || "Failed to update task")
    }
  }

  // const addRequest = async (request) => {
  //   setIsCreatingTask(true)
  //   try {
  //     if (!selectedBoard) {
  //       alert("Please select a board first")
  //       return
  //     }
  //     if (!selectedUser) {
  //       alert("Please select a user first")
  //       return
  //     }

  //     const tasksRef = doc(collection(db, "tasks"), selectedBoard.id)
  //     const tasksDoc = await getDoc(tasksRef)

  //     const newTask = {
  //       id: uuidv4(),
  //       text: request,
  //       createdAt: new Date().toISOString(),
  //       createdBy: user?.email,
  //       assignedTo: selectedUser.id,
  //       status: "pending"
  //     }

  //     if (tasksDoc.exists()) {
  //       const tasksData = tasksDoc.data()
  //       const updatedTasks = tasksData.tasks ? [...tasksData.tasks, newTask] : [newTask]
        
  //       await updateDoc(tasksRef, {
  //         tasks: updatedTasks
  //       })
  //     } else {
  //       await setDoc(tasksRef, {
  //         tasks: [newTask]
  //       })
  //     }

  //     // Update local state
  //     const updatedTaskList = tasksDoc.exists() 
  //       ? [...(tasksDoc.data().tasks || []), newTask]
  //       : [newTask]
      
  //     setTaskList(updatedTaskList)
  //   } catch (error) {
  //     console.error("Error adding task:", error)
  //     alert("Failed to add task. Please try again.")
  //   } finally {
  //     setIsCreatingTask(false)
  //   }
  // }

  return (
    <>
    <Header />
    <main className="p-8 min-h-screen dark bg-slate-900 text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <BoardSelector 
              boards={boards} 
              selectedBoard={selectedBoard} 
              onSelectBoard={handleSelectBoard}
              onCreateBoard={createNewBoard}
              isCreatingBoard={isCreatingBoard}
            />
            <UserSelector
              onSaveUserToBoard={onSaveUserToBoard}
              onRemoveUserFromBoard={removeUserFromBoard}
              currentMembersIds={selectedBoard?.members?.map(member => member.id) || []}
              isDisabled={!selectedBoard?.id}
              isLoading={isAddingUserToBoard || isRemovingUser}
            />
          </div>
          <div>
            <Button className="bg-red-100 hover:bg-red-300 transition-colors duration-300">Delete Board <Trash2 className="w-4 h-4 text-red-500" /></Button>
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
            isCreatingTask={isCreatingTask}
            isLoadingTasks={isLoadingTasks}
            onRemoveUser={removeUserFromBoard}
          />
        </div>
      </div>
    </main>
    </>
  );
}