import { db } from "../lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, setDoc, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export const getBoardsList = async (userId) => {
  if (!userId) {
    console.log('No user or user email available');
    return [];
  }
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.boards || [];
    } else {
      console.warn(`No user document found for email: ${userId}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user's boards:", error);
    return [];
  }
};

export const createNewBoard = async (boardName, user, boards) => {
  if (!boardName || !boardName.trim()) {
    throw new Error('Board name is required');
  }

  console.log("Creating new board:", boardName, user, boards);

  if (!user?.email || !user?.name) {
    throw new Error('User information is required');
  }

  if (boards?.some(board => board.name === boardName)) {
    throw new Error(`Board "${boardName}" already exists`);
  }

  const boardId = uuidv4();
  const newBoard = {
    id: boardId,
    name: boardName.trim(),
    createdAt: new Date().toISOString(),
    members: [{ id: user.email, name: user.name }],
    createdBy: user.email,
  };

  try {
    const boardsRef = collection(db, "boards");
    await setDoc(doc(boardsRef, boardId), newBoard);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        boards: arrayUnion({ id: boardId, name: boardName })
      });
    }

    const boardDocRef = doc(db, "boards", boardId);
    const boardDoc = await getDoc(boardDocRef);
    if (boardDoc.exists()) {
      return boardDoc.data();
    }
    throw new Error("Failed to create board");
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

export const fetchBoardData = async (boardId) => {
  try {
    const boardRef = doc(db, "boards", boardId);
    const boardDoc = await getDoc(boardRef);
    if (!boardDoc.exists()) {
        console.log("Board document does not exist");
    }
    return boardDoc.data();
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
};

export const deleteBoard = async (board, members) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this board? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const boardRef = doc(db, "boards", board);
      const boardDoc = await getDoc(boardRef);
      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }
      if (boardDoc.data().createdBy !== user?.email) {
        throw new Error("You don't have permission to delete this board");
      }

      const updatePromises = members.map(async (member) => {
        const userRef = doc(db, "users", member.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedBoards = (userData.boards || []).filter(b => b.id !== board);
          await updateDoc(userRef, { boards: updatedBoards });
        }
      });

      await Promise.all(updatePromises);

      const tasksRef = doc(db, "tasks", board);
      await deleteDoc(tasksRef);

      await deleteDoc(boardRef);

      setBoards(prevBoards => prevBoards.filter(b => b.id !== board));

      alert('Board deleted successfully');
    } catch (error) {
      console.error("Error deleting board:", error);
      alert(error.message || "Failed to delete board. Please try again.");
    }
};

export const removeUserFromBoard = async (userToRemove, selectedBoard, setIsRemovingUser, setSelectedBoard) => {
  const confirmRemove = window.confirm(`Are you sure you want to remove ${userToRemove.name} from this board?`)
  
  if (!confirmRemove) return

  setIsRemovingUser(true)
  try {
    if (!selectedBoard?.id) {
      throw new Error("No board selected")
    }

    // Get direct reference to board document
    const boardRef = doc(db, "boards", selectedBoard.id);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error("Board not found");
    }

    const boardData = boardDoc.data();
    const updatedMembers = (boardData.members || [])
      .filter(member => member.id !== userToRemove.id);

    // Get reference to user document
    const userRef = doc(db, "users", userToRemove.id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const updatedBoards = (userData.boards || [])
      .filter(board => board.id !== selectedBoard.id);

    // Perform atomic updates
    await Promise.all([
      updateDoc(boardRef, { members: updatedMembers }),
      updateDoc(userRef, { boards: updatedBoards })
    ]);

    // Update local state
    setSelectedBoard(prevBoard => ({
      ...prevBoard,
      members: updatedMembers
    }));

    alert(`${userToRemove.name} has been removed from the board.`);
  } catch (error) {
    console.error("Error removing user from board:", error);
    alert(error.message || "Failed to remove user from the board");
  } finally {
    setIsRemovingUser(false);
  }
}