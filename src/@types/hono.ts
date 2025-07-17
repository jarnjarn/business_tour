// @/types/hono.ts
export type UserPayload = {
    id: string;
    // có thể thêm email, role... nếu cần
  };
  
  export type EnvWithUser = {
    Variables: {
      user: UserPayload;
    };
  };
  