export function interleaveArrays(
  primaryIds: number[],
  secondaryIds: number[],
): number[] {
  const result: number[] = [];
  const ratio = secondaryIds.length / primaryIds.length;

  let primaryIndex = 0;
  let secondaryIndex = 0;

  while (primaryIndex < primaryIds.length) {
    if (!result.includes(primaryIds[primaryIndex])) {
      result.push(primaryIds[primaryIndex]);
    }

    const targetSecondaryCount =
      Math.round((primaryIndex + 1) * ratio) - result.length + primaryIndex + 1;

    for (
      let i = 0;
      i < targetSecondaryCount && secondaryIndex < secondaryIds.length;
      i++
    ) {
      if (!result.includes(secondaryIds[secondaryIndex])) {
        result.push(secondaryIds[secondaryIndex]);
      }
      secondaryIndex++;
    }

    primaryIndex++;
  }

  while (secondaryIndex < secondaryIds.length) {
    if (!result.includes(secondaryIds[secondaryIndex])) {
      result.push(secondaryIds[secondaryIndex]);
    }
    secondaryIndex++;
  }

  return result;
}
