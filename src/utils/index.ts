export const getAddress = (address) => {
  if (!address) {
    return undefined;
  }
  return `${address?.address}, ${address?.ward} , ${address?.district} , ${address?.province}`;
};
