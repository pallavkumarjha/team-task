"use client";
import { useState, useEffect } from "react"
import Board from "../../components/Board"
import UserSelector from "../../components/UserSelector"
import BoardSelector from "../../components/BoardSelector"
import { Card, CardContent } from "../../components/ui/card"
import Link from "next/link"

import { Info, Loader2, LogOut, Trash2 } from "lucide-react"
import DeleteBoardDialog from "../../components/DeleteBoardDialog"
import { getBoardsList, createNewBoard, fetchBoardData, deleteBoard, removeUserFromBoard } from "../../services/boardService"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { fetchTasks, onUpdateTask, saveTask } from "../../services/taskService"
import { Button } from "../../components/ui/button";
import { Header } from "../../components/Header";
import { useSession } from "next-auth/react";
import CreateBoardDialog from "../../components/CreateBoardDialog";

export default function Dashboard() {
  const { data: session, status  } = useSession();
  const user = session?.user;

  const [teamMembers, setTeamMembers] = useState([])
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState("")
  const [taskList, setTaskList] = useState({})
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [isAddingUserToBoard, setIsAddingUserToBoard] = useState(false)
  const [isRemovingUser, setIsRemovingUser] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    if(!user?.email) return
    fetchBoards()

    const pollingInterval = setInterval(() => {
      if (selectedBoard?.id) {
        fetchBoardData(selectedBoard.id).then(boardData => {
          setSelectedBoard(boardData)
          fetchTasks(boardData.id).then(setTaskList)
        })
      }
      fetchBoards()
    }, 5 * 60 * 1000)
    return () => clearInterval(pollingInterval)
  }, [user, selectedBoard?.id])

  useEffect(() => {
    if (status !== 'loading') {
      setIsUserLoading(false);
    }
  }, [status]);

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

  const renderWarnings = () => {
    if(isUserLoading) {
      return (
        <div className="text-center mb-8">
          <Loader2 className="animate-spin h-10 w-10 mx-auto" />
          <p className="mt-2 text-sm text-slate-400">Loading...</p>
        </div>
      )
    }

    return !user?.email ? (
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
            onClick={() => setIsCreateBoardOpen(true)}
            className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 transition-colors duration-300"
          >
            Create Board
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
    <Header />
    <main className="p-8 min-h-screen dark bg-slate-900 text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 dark:bg-slate-800/10 rounded-2xl p-6 shadow-xl border border-slate-200/20 dark:border-slate-700/20 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                variant="outline"
                disabled={isCreatingBoard}
                onClick={() => setIsCreateBoardOpen(true)}
                className="relative overflow-hidden group bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 transition-all duration-300"
              >
                {isCreatingBoard ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Create board</span>
                    <span className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 transition-transform duration-300"></span>
                    <span className="ml-2 text-lg font-bold leading-none">+</span>
                  </>
                )}
              </Button>
              <CreateBoardDialog
                isOpen={isCreateBoardOpen}
                onClose={() => setIsCreateBoardOpen(false)}
                onCreateBoard={handleCreateBoard}
                isCreating={isCreatingBoard}
              />
              <div className="flex items-center gap-4 flex-1">
                <BoardSelector 
                  boards={boards} 
                  selectedBoard={selectedBoard} 
                  onSelectBoard={handleSelectBoard}
                  className="min-w-[200px]"
                />
                <UserSelector
                  onSaveUserToBoard={onSaveUserToBoard}
                  currentMembersIds={selectedBoard?.members?.map(member => member.id) || []}
                  isDisabled={!selectedBoard?.id}
                  isLoading={isAddingUserToBoard || isRemovingUser}
                />
              </div>
            </div>
            <div>
              {selectedBoard?.createdBy === user?.email && (
                <>
                  <Button 
                    onClick={() => setIsDeleteBoardOpen(true)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30 hover:border-red-500/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Delete Board
                      <Trash2 className="w-4 h-4 ml-2 transform group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <span className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-red-500/10 transition-transform duration-300"></span>
                  </Button>
                  <DeleteBoardDialog
                    isOpen={isDeleteBoardOpen}
                    onClose={() => setIsDeleteBoardOpen(false)}
                    onConfirm={async () => {
                      await deleteBoard(selectedBoard.id, selectedBoard.members, user, setBoards);
                      setSelectedBoard("");
                      setTaskList({});
                      localStorage.removeItem("selectedBoard");
                      setIsDeleteBoardOpen(false);
                    }}
                    boardName={selectedBoard?.name}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {renderWarnings()}
        <div className="mt-8">
          <Board
            teamMembers={teamMembers}
            selectedUser={user}
            onSaveTask={handleSaveTask}
            taskList={taskList}
            onUpdateTask={onUpdateTaskItem}
            isLoadingTasks={isLoadingTasks}
            onRemoveUser={removeUser}
          />
        </div>
      </div>
    </main>
    </>
  );
}