export const resObj = (payload: any) => {
  const success = payload?.success || true;
  const message = payload?.message || true;
  let data = {};
  let _;
  if (payload) {
    ({ success: _, message: _, ...data } = payload);
  }

  return {
    success,
    message,
    data,
  };
};
