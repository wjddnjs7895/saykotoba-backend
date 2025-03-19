export function parseDuration(durationString: string): number {
  if (!durationString || typeof durationString !== 'string') {
    throw new Error('유효한 기간 문자열이 필요합니다.');
  }

  const value = parseInt(durationString);

  if (isNaN(value)) {
    throw new Error('기간 문자열에 유효한 숫자가 포함되어야 합니다.');
  }

  if (durationString.endsWith('d')) {
    return value * 24 * 60 * 60 * 1000;
  } else if (durationString.endsWith('h')) {
    return value * 60 * 60 * 1000;
  } else if (durationString.endsWith('m')) {
    return value * 60 * 1000;
  } else {
    return value * 1000;
  }
}
