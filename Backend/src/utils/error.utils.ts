import { GraphQLError } from "graphql";
export const ErrorCodes = {
  FORBIDDEN: "FORBIDDEN",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  ACTIVITY_LOGS_FAILED: 'ACTIVITY_LOGS_FAILED',
  ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_INPUT_DATA: "INVALID_INPUT_DATA",
  EMAIL_FORMAT_INVALID: "EMAIL_FORMAT_INVALID"

}

export type errorCode = keyof typeof ErrorCodes

export const errorMap: Record<errorCode, string> = {
  UNAUTHENTICATED: "Authentication is required",
  FORBIDDEN: "You do not have permission to perform this action",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  ACTIVITY_LOGS_FAILED: "Failed to retrieve activity logs",
  ACCOUNT_INACTIVE: "This account is inactive",
  INVALID_INPUT_DATA: "Invalid input data",
  EMAIL_FORMAT_INVALID: "Email format is invalid"
};


export const throwGraphqlError = (errMessage: string, errorCode: errorCode) => {
  throw new GraphQLError(errMessage, {
    extensions: {
      code: errorCode,
    },
  });
};
