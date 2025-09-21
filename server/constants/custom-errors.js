export const ERRORS = {
  USER_ALREADY_EXISTS: 
  { code: 10001, message: "User already exists." },

  INVALID_PASSWORD: 
  { code: 10002, message: "Password must be at least 8 characters long and include at least one letter and one number." },

  REGISTER_FAILED: 
  { code: 10003, message: "Create user with password failed" },

  USER_NOT_FOUND: 
  { code: 10004, message: "User not found" },

  INVALID_USER: 
  { code: 10005, message: "Invalid user data" },

  PASSWORD_NOT_MATCH: 
  { code: 10006, message: "Invalid password, please try again." },

  INVALID_TOKEN: 
  { code: 10007, message: "Invalid current token to refresh" },

  USER_NOT_FOUND_IN_HEADER: 
  { code: 10008, message: "User not found by header token" },

};
