export const copyText = (text) => navigator.clipboard.writeText(text);

export function moveItemInArray(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    // eslint-disable-next-line no-plusplus
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}
