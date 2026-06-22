import { GraphQLError } from "graphql";
export const ErrorCodes = {
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXIST: "Email is already exist",
  ACTIVITY_LOGS_FAILED:'Activity log return failed'

}

export type errorCode = keyof typeof ErrorCodes

export const errorMap: Record<errorCode, string> = {
  FORBIDDEN: "Account is inactive",
  UNAUTHORIZED: "Invalid email or password",
  USER_NOT_FOUND: "Email is not exist in users",
  EMAIL_ALREADY_EXIST: "Email is already exist",
  ACTIVITY_LOGS_FAILED:'Activity log return failed'
};


export const throwGraphqlError = (errMessage: string, errorCode: errorCode) => {
  throw new GraphQLError(errMessage, {
    extensions: {
      code: errorCode,
    },
  });
};
