import { TableCell } from "@/components/ui/table";

interface MetricsCellProps {
  value: number | undefined;
  className?: string;
}

export const MetricsCell = ({ value, className = "text-right" }: MetricsCellProps) => (
  <TableCell className={className}>
    {value?.toLocaleString() ?? 'N/A'}
  </TableCell>
);