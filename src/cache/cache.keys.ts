export const redisRefreshKey = (userId: string) => {
  return `refresh:${userId}`;
};

export const redisUserKey = (userId: string) => {
  return `user:${userId}`;
};

export const redisRestorePasswordKey = (key: string) => {
  return `restorePassword:${key}`;
};

export const redisUserLinkKey = (key: string) => {
  return `userLink:${key}`;
};

export const redisTaskKey = (taskId: string) => {
  return `task:${taskId}`;
};

export const redisQueryTaskKey = (query?: string) => {
  return `tasks:${query}`;
};

export const redisTempMailKey = (key: string) => {
  return `tmpMail:${key}`;
};

export const redisLoginEventKey = () => {
  return `tmpLoginEvent`;
};
