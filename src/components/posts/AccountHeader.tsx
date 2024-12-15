import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AccountHeaderProps {
  accountHandle: string;
  profileImage?: string;
  period?: string;
}

export const AccountHeader = ({ accountHandle, profileImage, period }: AccountHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={profileImage} alt={accountHandle} />
        <AvatarFallback>{accountHandle.slice(1, 3).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">{accountHandle}</h2>
        {period && <p className="text-sm text-gray-500">{period}</p>}
      </div>
    </div>
  );
};