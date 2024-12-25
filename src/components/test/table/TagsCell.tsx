import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TagsCellProps {
  tags: string[];
  prefix: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const TagsCell = ({ tags, prefix, variant = "secondary" }: TagsCellProps) => (
  <TableCell>
    <div className="flex flex-wrap gap-1">
      {tags?.map((tag: string, index: number) => (
        <Badge key={index} variant={variant}>{prefix}{tag}</Badge>
      ))}
    </div>
  </TableCell>
);