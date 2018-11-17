export function genErrResponse(text: string, err?: any): any {
  if (err) {
    console.error(err);
  }

  return {
    err: text
  };
}
