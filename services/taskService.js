import { db } from "../lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

export const fetchTasks = async (boardId) => {
  try {
    const tasksRef = doc(collection(db, "tasks"), boardId);
    const tasksSnapshot = await getDoc(tasksRef);
    if (tasksSnapshot.exists()) {
        console.log('Tasks data:', tasksSnapshot.data());
      return tasksSnapshot.data();
    }
    return {};
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {};
  }
};

export const saveTask = async (task, selectedBoard, user) => {
  try {
    if (!selectedBoard?.id) {
      throw new Error("No board selected");
    }

    if (!user?.id) {
      throw new Error("No user selected");
    }

    const boardsRef = collection(db, "boards");
    const q = query(boardsRef, where("id", "==", selectedBoard.id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Board document not found");
    }

    const boardDocumentId = querySnapshot.docs[0].id;

    const taskToSave = {
      ...task,
      boardId: selectedBoard.id,
      boardName: selectedBoard.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasksRef = doc(collection(db, "tasks"), boardDocumentId);
    const currentTasks = (await getDoc(tasksRef)).data() || {};

    const userTasks = currentTasks[task.metadata.toId] || [];
    const existingTaskIndex = userTasks.findIndex(existingTask => existingTask.id === task.id);

    if (existingTaskIndex !== -1) {
      userTasks[existingTaskIndex] = { ...userTasks[existingTaskIndex], ...taskToSave };
    } else {
      userTasks.push(taskToSave);
    }

    await setDoc(tasksRef, {
      [task.metadata.toId]: userTasks
    }, { merge: true });

    return {
      ...taskToSave,
      firestoreId: boardDocumentId
    };
  } catch (error) {
    console.error("Error saving task:", error);
    throw error;
  }
};

export const onUpdateTask = async (task, selectedBoard, user, setTaskList) => {
    try {
      const updatedTask = await saveTask(task, selectedBoard, user)

      if (updatedTask) {
        setTaskList((prevTasks) => {
          const updatedTasks = { ...prevTasks }
          const userTasksArray = updatedTasks[task.metadata.toId] || []
          const taskIndex = userTasksArray.findIndex(t => t.id === task.id)
          if (taskIndex !== -1) {
            userTasksArray[taskIndex] = updatedTask
          }
          updatedTasks[task.metadata.toId] = userTasksArray
          
          return updatedTasks
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert(error.message || "Failed to update task")
    }
  }