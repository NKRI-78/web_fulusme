// contoh response api auth
// {
//     "status": 200,
//     "error": false,
//     "message": "Successfully",
//     "data": {
//         "id": "6fb6ffaa-f38b-4481-8b93-0db97693a49c",
//         "enabled": true,
//         "email": "antonijulio76@gmail.com",
//         "role": "investor",
//         "verify": false,
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJpZCI6IjZmYjZmZmFhLWYzOGItNDQ4MS04YjkzLTBkYjk3NjkzYTQ5YyJ9.Gj0wl0YhrJPuddFLMa6gJgCgF2o1Xhs5-B-dXOfj3e8"
//     }
// }

export type UserSession = {
  id: string;
  email: string;
  role: "investor" | "emiten" | "admin" | "user";
  enabled: boolean;
  verify: boolean;
  token: string;
};
