export const copyText = (text) => navigator.clipboard.writeText(text);

export function moveItemInArray(arr, old_index, new_index) {
  const newArray = JSON.parse(JSON.stringify(arr));
  if (new_index >= newArray.length) {
    let k = new_index - newArray.length + 1;
    // eslint-disable-next-line no-plusplus
    while (k--) {
      newArray.push(undefined);
    }
  }
  newArray.splice(new_index, 0, newArray.splice(old_index, 1)[0]);
  return newArray; // for testing
}
