export function getSelectedInventories(item, globalInventories = []) {
  const selectedInventories = item?.inventoryIds.split(",");
  const options = [...item.product.inventories, ...globalInventories].reduce(
    (acc, value) => {
      if (selectedInventories.includes(value.id.toString())) {
        acc.push(value);
      }
      return acc;
    },
    []
  );
  return options;
}
