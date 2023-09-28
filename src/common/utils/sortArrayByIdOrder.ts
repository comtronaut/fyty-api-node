function sortArrayByIdOrder<T extends { id: string }>(arrayToSort: T[], sortOrder: string[]): T[] {
  // Create a map to store the index of each ID in the sortOrder array
  const idIndexMap = Object.fromEntries(sortOrder.map((id, i) => [ id, i ]));

  // Use the map to sort the array based on the order of IDs in sortOrder
  arrayToSort.sort((a, b) => {
    const indexA = idIndexMap[a.id];
    const indexB = idIndexMap[b.id];

    if (typeof indexA === "undefined" && typeof indexB === "undefined") {
      // If both IDs are not in sortOrder, maintain their relative order
      return 0;
    } else if (typeof indexA === "undefined") {
      // If only A is not in sortOrder, move it to the end
      return 1;
    } else if (typeof indexB === "undefined") {
      // If only B is not in sortOrder, move it to the end
      return -1;
    } else {
      // Compare the indexes to determine the order
      return indexA - indexB;
    }
  });

  return arrayToSort;
}
