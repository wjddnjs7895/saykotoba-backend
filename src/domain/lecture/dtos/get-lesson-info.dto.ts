export class GetLessonInfoResponseDto {
  id: number;
  title: string;
  situation: string;
  aiRole: string;
  userRole: string;
  missions: {
    id: number;
    mission: string;
  }[];
  difficultyLevel: number;
  exp: number;
}
