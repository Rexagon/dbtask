export type ErrorType = "InvalidData" | "DBError" | "ServerError";

export function genErrResponse(text: ErrorType, err?: any): any {
  if (err) {
    console.error(err);
  }

  return {
    err: text
  };
}
