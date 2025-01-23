"use client";
import { useState, useEffect } from "react"
import Board from "../../components/Board"
import NewNoteForm from "../../components/NewNoteForm"
import UserSelector from "../../components/UserSelector"
import BoardSelector from "../../components/BoardSelector"
import { Card, CardContent } from "../../components/ui/card"
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

  // const handleSelectUser = (user) => {
  //   setSelectedUser(user)
  //   // const currentUser = teamMembers.find((member) => member.id === user)
  //   // if (currentUser) {
  //   //   setSelectedUser(currentUser)
  //   // }
  //   // localStorage.setItem("selectedUser", user)
  // }

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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 transition-colors duration-300"> {/* Updated background */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors duration-300" // Updated button styles
        >
          <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400" /> {/* Updated icon color */}
          Logout
        </Button>
      </div>
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
          </div>
        </div>
        {user?.accessToken && (
           <p className="text-slate-700 dark:text-slate-300 transition-colors duration-300">Hello, {user?.name}</p>
        )}
        {!selectedBoard?.id && (
          <Card className="mb-8 bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 transition-colors duration-300 mt-8">
            <CardContent className="flex items-center p-4">
              <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-colors duration-300 mr-2" />
              <p className="text-yellow-800 dark:text-yellow-200 transition-colors duration-300">Please select the board to start working.</p>
            </CardContent>
          </Card>
        )}
        <Board
          teamMembers={teamMembers}
          selectedUser={user}
          // onDeleteMember={deleteTeamMember}
          onSaveTask={saveTaskInTaskCollectionWhereCollectionIdIsBoardId}
          taskList={taskList}
          onUpdateTask={onUpdateTask}
        />
      </div>
    </main>
  );
}