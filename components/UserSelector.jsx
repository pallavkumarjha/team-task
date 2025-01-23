import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserSelector({
  users,
  selectedUser,
  onSelectUser
}) {
  return (
    (<Select value={selectedUser?.id} onValueChange={onSelectUser}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select identity" />
      </SelectTrigger>
      <SelectContent>
        {users?.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>)
  );
}

