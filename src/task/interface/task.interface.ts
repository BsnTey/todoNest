import { TaskSeverity, TaskStatus } from '../../common';

export interface FindAllFilters {
  userId?: string;
  limit: number;
  offset: number;
  search?: string;
  status?: TaskStatus;
  severity?: TaskSeverity;
}
