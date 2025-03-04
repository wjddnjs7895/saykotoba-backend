export function sortLectureIdsByDifficulty(
  lectureIds: number[],
  allLectures: any[],
): number[] {
  const lectureWithDifficulty = lectureIds.map((id) => {
    const lecture = allLectures.find((l) => l.id === id);
    return {
      id,
      difficultyAvg: lecture
        ? (lecture.difficultyLevelStart + lecture.difficultyLevelEnd) / 2
        : 0,
    };
  });

  lectureWithDifficulty.sort((a, b) => a.difficultyAvg - b.difficultyAvg);

  return lectureWithDifficulty.map((item) => item.id);
}
