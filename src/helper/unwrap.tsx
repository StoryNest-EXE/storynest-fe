export const unwrap = async <T,>(
  p: globalThis.Promise<{ status: number; payload: T }>
): Promise<T> => {
  const response = await p;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, payload } = response;
  return payload;
};
