import { MetricType } from "../charts/types";
import { LucideIcon } from "lucide-react";

export interface MetricData {
  id: string;
  title: string;
  value: string;
  change: number;
  subValue: string;
  period: string;
  icon: LucideIcon;
  metric: MetricType;
}