export class CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  severity: TaskSeverity;
  author: string;
  assignee: string;
}

export enum TaskStatus {
  NEW,
  IN_PROGRESS,
  ON_HOLD,
  PENDING,
  COMPLETED,
}

export enum TaskSeverity {
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL,
}
