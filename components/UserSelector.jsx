import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserSelector({
  users,
  selectedUser,
  onSelectUser
}) {
  return (
    (<Select value={selectedUser} onValueChange={onSelectUser}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select identity" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user} value={user}>
            {user}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>)
  );
}

