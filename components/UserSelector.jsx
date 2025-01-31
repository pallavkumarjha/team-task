"use client";

import { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

export default function UserSelector({
  onSaveUserToBoard,
  currentMembersIds = [],
  isDisabled = false,
  isAddingUserToBoard = false,
  isLoading = false
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(user => user.name); // Ensure user has a name
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderCheckbox = (user) => {
    if(currentMembersIds.includes(user.id)) {
      return <Check className="h-4 w-4 text-green-500" />
    }
    if(isAddingUserToBoard) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
  }

  if (isDisabled) {
    return null
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} >
      <Popover.Trigger asChild>
        {!isLoading ? (
          <button 
            className="flex items-center justify-between w-[300px] px-3 py-1.5 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
          >
            <span>
              Add user to board
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        ) : (
          <Loader2 className="animate-spin h-4 w-4 text-emerald-500" />
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="z-50 w-[300px] bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2"
          sideOffset={5}
        >
          <div className="mb-2">
            <input 
              type="text"
              placeholder="Search users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-2 py-1 border rounded-md text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-2">
              No users found
            </div>
          ) : (
            <ul className="max-h-[300px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <li 
                  key={user.id}
                  onClick={() => {
                    onSaveUserToBoard(user);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded-md transition-colors duration-200"
                >
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({user.email})</span>
                  </div>
                  {renderCheckbox(user)}
                </li>
              ))}
            </ul>
          )}
          <Popover.Arrow className="fill-slate-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}