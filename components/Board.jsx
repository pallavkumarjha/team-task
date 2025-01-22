import StickyNote from "@/components/StickyNote"

export default function Board({
  teamMembers,
  selectedUser,
  onSaveTask,
  onUpdateTask,
  taskList
}) {
  const getTasksForMember = (member) => {
    return taskList[member.id] || []
  }

  return (
    (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamMembers.map((member, index) => (
        <StickyNote
          key={member.id+index}
          memberName={member.name}
          memberId={member.id}
          tasks={getTasksForMember(member)}
          selectedUser={selectedUser}
          onSaveTask={onSaveTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>)
  );
}

