import StickyNote from "@/components/StickyNote"

export default function Board({
  teamMembers,
  selectedUser
}) {
  return (
    (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamMembers.map((member, index) => (
        <StickyNote key={index} memberName={member} selectedUser={selectedUser} />
      ))}
    </div>)
  );
}

