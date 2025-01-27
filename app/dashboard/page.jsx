"use client";
import { useState, useEffect } from "react"
import Board from "../../components/Board"
import UserSelector from "../../components/UserSelector"
import BoardSelector from "../../components/BoardSelector"
import { Card, CardContent } from "../../components/ui/card"
import Link from "next/link"

import { Info, Loader2, LogOut, Trash2 } from "lucide-react"
import { getBoardsList, createNewBoard, fetchBoardData, deleteBoard, removeUserFromBoard } from "../../services/boardService"
import { collection, doc, getDoc, deleteDoc, updateDoc, query, where, arrayUnion } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { fetchTasks, onUpdateTask, saveTask } from "../../services/taskService"
import { Button } from "../../components/ui/button";
import { Header } from "../../components/Header";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session  } = useSession();
  const user  = session?.user;

  const [teamMembers, setTeamMembers] = useState([])
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
    }
  }, [selectedBoard])

  const saveSelectedBoardToLocalStorage = (board) => {
    localStorage.setItem("selectedBoard", board)
  }

  const fetchBoards = async () => {
    const boardsList = await getBoardsList(user?.email)
    if(!boardsList) return
    const savedBoard = localStorage.getItem("selectedBoard")
    if (savedBoard) {
      const currentBoard = boardsList.find((b) => b.id === savedBoard)
      if (currentBoard) {
        const boardData = await fetchBoardData(currentBoard.id)
        setSelectedBoard(boardData)
        setTaskList(await fetchTasks(boardData?.id))
      }
    }
    setBoards(boardsList)
  }

  const loadTasks = async (boardId) => {
    try {
      const tasksData = await fetchTasks(boardId)
      setTaskList(tasksData)
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTaskList({})
    }
  }

  const handleCreateBoard = async (boardName) => {
    if (!boardName || boards.some(board => board.name === boardName)) {
      alert(`Board "${boardName}" already exists`)
      return
    }

    console.log('boardName, user, boards', boardName, user, boards)

    setIsCreatingBoard(true)
    try {
      const newBoard = await createNewBoard(boardName, user, boards)
      setBoards([...boards, newBoard])
      setSelectedBoard(newBoard)
      saveSelectedBoardToLocalStorage(newBoard.id)
      await loadTasks(newBoard.id)
    } catch (error) {
      console.error("Error creating board:", error)
      alert("Failed to create board. Please try again.")
    } finally {
      setIsCreatingBoard(false)
    }
  }

  const handleSelectBoard = async (boardId) => {
    setIsLoadingTasks(true)
    try {
      const boardData = await fetchBoardData(boardId)
      setSelectedBoard(boardData)
      await loadTasks(boardData.id)
      saveSelectedBoardToLocalStorage(boardData.id)
    } catch (error) {
      console.error("Error selecting board:", error)
      alert("Failed to select board")
    } finally {
      setIsLoadingTasks(false)
    }
  }

  const onSaveUserToBoard = async (newUser) => {
    if (!newUser?.id || !newUser?.name) {
      alert('Invalid user data');
      return;
    }

    if (!selectedBoard?.id) {
      alert('No board selected');
      return;
    }

    setIsAddingUserToBoard(true);
    try {
      const boardRef = doc(db, "boards", selectedBoard.id);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      const boardData = boardDoc.data();
      const existingMembers = boardData.members || [];
      const userExists = existingMembers.some(member => member.id === newUser.id);

      if (userExists) {
        alert('User is already a member of this board');
        return;
      }

      const userRef = doc(db, "users", newUser.id);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      // Perform atomic updates
      await updateDoc(boardRef, {
        members: arrayUnion({ id: newUser.id, name: newUser.name })
      });

      await updateDoc(userRef, {
        boards: arrayUnion({ id: selectedBoard.id, name: selectedBoard.name })
      });

      // Update local state
      setSelectedBoard(prevBoard => ({
        ...prevBoard,
        members: [...(prevBoard.members || []), { id: newUser.id, name: newUser.name }]
      }));

    } catch (error) {
      console.error("Error saving user to board:", error);
      alert(error.message || "Failed to add user to the board");
    } finally {
      setIsAddingUserToBoard(false);
    }
  };

  const removeUser = async (userToRemove) => {
    await removeUserFromBoard(userToRemove, selectedBoard, setIsRemovingUser, setSelectedBoard)
  }

  const handleSaveTask = async (task) => {
    try {
      const savedTask = await saveTask(task, selectedBoard, user)
      return savedTask
    } catch (error) {
      console.error("Error saving task:", error)
      alert(error.message || "Failed to save task")
      return null
    }
  }

  const onUpdateTaskItem = async (task) => {
    try {
      await onUpdateTask(task, selectedBoard, user, setTaskList)
    } catch (error) {
      console.error("Error updating task:", error)
      alert(error.message || "Failed to update task")
    }
  }

  return (
    <>
    <Header />
    <main className="p-8 min-h-screen dark bg-slate-900 text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              disabled={isCreatingBoard}
              onClick={() => {
                const boardName = prompt("Enter the name of the new board:");
                if (boardName && boardName.trim()) {
                  handleCreateBoard(boardName.trim());
                }
              }}
            >
            {isCreatingBoard ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create board +"
            )}
            </Button>
            <BoardSelector 
              boards={boards} 
              selectedBoard={selectedBoard} 
              onSelectBoard={handleSelectBoard}
            />
            <UserSelector
              onSaveUserToBoard={onSaveUserToBoard}
              onRemoveUserFromBoard={removeUser}
              currentMembersIds={selectedBoard?.members?.map(member => member.id) || []}
              isDisabled={!selectedBoard?.id}
              isLoading={isAddingUserToBoard || isRemovingUser}
            />
          </div>
          <div>
            {selectedBoard?.createdBy === user?.email && (
              <Button 
                onClick={async () => {
                  await deleteBoard(selectedBoard.id, selectedBoard.members)
                  setSelectedBoard("");
                  setTaskList({});
                  localStorage.removeItem("selectedBoard");
                }}
                className="bg-red-100 hover:bg-red-300 transition-colors duration-300"
              >
                Delete Board <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
        {!user?.email ? (
          <Card className="mb-8 bg-red-50 dark:bg-red-900/50 border-2 border-red-300 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 mt-8 group">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <LogOut className="w-6 h-6 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-red-800 dark:text-red-200 mb-1">Authentication Required</h3>
                  <p className="text-red-700 dark:text-red-300">Please login to access your boards and collaborate with your team.</p>
                </div>
              </div>
              <Link href="/login">
                <Button className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 transition-colors duration-300">
                  Login Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : !selectedBoard?.id && (
          <Card className="mb-8 bg-yellow-50 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 mt-8 group">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Info className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-yellow-800 dark:text-yellow-200 mb-1">No Board Selected</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">Select or create a board to start collaborating with your team.</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  const boardName = prompt("Enter the name of the new board:");
                  if (boardName && boardName.trim()) {
                    handleCreateBoard(boardName.trim());
                  }
                }}
                className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 transition-colors duration-300"
              >
                Create Board
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="mt-8">
          <Board
            teamMembers={teamMembers}
            selectedUser={user}
            onSaveTask={handleSaveTask}
            taskList={taskList}
            onUpdateTask={onUpdateTaskItem}
            isCreatingTask={isCreatingTask}
            isLoadingTasks={isLoadingTasks}
            onRemoveUser={removeUser}
          />
        </div>
      </div>
    </main>
    </>
  );
}