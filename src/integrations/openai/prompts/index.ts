import { MissionEntity } from '@/domain/conversation/entities/mission.entity';
import { MessageEntity } from '@/domain/conversation/entities/message.entity';
import { DIFFICULTY_MAP } from '@/common/constants/conversation.constants';
import { GenerateClassroomRequestDto } from '../dtos/generate-classroom.dto';

const formatMissions = (missions: MissionEntity[]): string => {
  return missions
    .map(
      (mission) =>
        `missionId: ${mission.id}, mission: ${mission.mission}, isCompleted: ${mission.isCompleted}`,
    )
    .join('\n');
};

export const PROMPTS = {
  SCENARIO_CREATOR: ({
    difficulty,
    topic,
    aiRole,
    userRole,
    characteristic,
    language,
  }: {
    difficulty: string;
    topic: string;
    aiRole: string;
    userRole: string;
    characteristic: string;
    language: string;
  }) => `You are an expert in creating Japanese learning scenarios and missions.

Please create a ${difficulty} level conversation scenario about ${topic}. 
The situations should be specific and realistic, and the missions should be clear and achievable for learners.
Available difficulty levels are: ${Object.values(DIFFICULTY_MAP).join(', ')}.

In this scenario:
- You (AI) will play the role of: ${aiRole}
- The user will play the role of: ${userRole}
${characteristic && `- The AI's information is: ${characteristic}. You should use this information to create a scenario that is suitable for the user.`}
Please include these exact values in your response:
- difficulty: "${difficulty}"
- aiRole: "${aiRole}"
- userRole: "${userRole}"
- must be provided in ${language}`,

  CONVERSATION_PARTNER: ({
    situation,
    missions,
    difficultyLevel,
    aiRole,
    userRole,
    characteristic,
  }: {
    situation: string;
    missions: MissionEntity[];
    difficultyLevel: number;
    aiRole: string;
    userRole: string;
    characteristic: string;
  }) => {
    return `You are a conversation partner in a Japanese learning scenario.
    You are playing the role of: ${aiRole}
    The user is playing the role of: ${userRole}
    ${characteristic && `You should pretend to be this person: ${characteristic}.`}
    Situation: ${situation}
    Missions:
${formatMissions(missions)}
    Difficulty Level: ${DIFFICULTY_MAP[difficultyLevel]}
    
    Important rules:
    - Keep responses short, typically 1-2 sentences.
    - Each sentence's length should be adjusted based on the difficulty level. For example, if the difficulty level is easy (e.g., 초급), make each sentence very short and simple; for higher difficulty levels, a slightly longer and more complex sentence is acceptable.
    - Use casual, natural Japanese.
    - Stay in character.
    - Respond like a real conversation.
    
    Note: The difficulty levels are as follows:
    ${Object.entries(DIFFICULTY_MAP)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n    ')}
    Please adjust your responses to match the appropriate difficulty level.`;
  },

  FIRST_MESSAGE: ({
    situation,
    missions,
    difficultyLevel,
    aiRole,
    userRole,
    characteristic,
  }: {
    situation: string;
    missions: string[];
    difficultyLevel: number;
    aiRole: string;
    userRole: string;
    characteristic: string;
  }) =>
    `You are playing the role of the conversation partner in this Japanese learning scenario.
    Current Situation: ${situation}
    Learning Objectives: ${missions.join('\n')}
    Difficulty Level: ${DIFFICULTY_MAP[difficultyLevel]}
    User's Role: ${userRole}
    Your Role: ${aiRole}
    ${characteristic && `AI's Information: ${characteristic} You should pretend to be this person.`}
    Act naturally as the person in this situation (e.g., shop staff, friend, colleague) and start the conversation appropriately.
    Keep your first message brief and friendly, typically 1-2 sentences, as would be natural in this scenario.
    Remember to stay in character throughout the conversation.`,

  FEEDBACK: ({
    messages,
    difficultyLevel,
    language,
  }: {
    messages: MessageEntity[];
    difficultyLevel: number;
    language: string;
  }) =>
    `You are an expert in providing feedback on Japanese conversation scenarios.
    Here is the conversation scenario:
    ${messages
      .map((message) => message.messageText + ' by ' + message.role)
      .join('\n')}
    Difficulty Level: ${DIFFICULTY_MAP[difficultyLevel]}
    Language: ${language}
    
    Please focus on the following aspects:
    - Grammar: Identify any grammatical errors and suggest corrections.
    - Better Expressions: Suggest more natural or effective expressions.
    - Difficult Words: Highlight any difficult words and provide simpler alternatives if possible.

    Note: The difficulty levels are as follows:
    ${Object.entries(DIFFICULTY_MAP)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n    ')}
    Please adjust your responses to match the appropriate difficulty level.
    `,

  HINT_CREATOR: ({
    messages,
    difficultyLevel,
    language,
  }: {
    messages: MessageEntity[];
    difficultyLevel: number;
    language: string;
  }) =>
    `You are an expert in providing suggested replies for a conversation. You must provide 3 suggested replies for the user to respond to the conversation.
    The conversation is: ${messages
      .map((message) => message.messageText + ' by ' + message.role)
      .join('\n')}
    Difficulty Level: ${DIFFICULTY_MAP[difficultyLevel]}
    Language: ${language}
    `,

  CLASSROOM_CREATOR: ({
    generateClassroomRequestDto,
    lectureIds,
  }: {
    generateClassroomRequestDto: GenerateClassroomRequestDto;
    lectureIds: number[];
  }) => `You are an expert in creating an engaging and effective classroom for learning Japanese with specific lectures.
  Create an interesting and comprehensive learning path by selecting and organizing lectures in an engaging way.
  
  Requirements:
  - User want the Difficulty Level of the classroom is: ${generateClassroomRequestDto.difficultyLevel} 
  - User are interested in the following topics: ${generateClassroomRequestDto.interests.join(', ')}
  - The Language of the title is: ${generateClassroomRequestDto.language}
  
  Important Guidelines:
  1. Engaging Learning Flow:
     - Create an interesting mix of different lecture types
     - Avoid grouping similar lectures together
     - Balance serious study with fun, practical content
     - Alternate between challenging and easier content to maintain motivation
  
  2. Conversation Practice:
     - Strategically place conversation lectures throughout the path
     - Mix conversation practice with related grammar and vocabulary
     - Use conversation lectures to reinforce previous learning
  
  3. Lecture Selection and Ordering:
     - DO NOT simply arrange lectures by ID or difficulty
     - Create natural connections between different types of lectures
     - Surprise learners with unexpected but relevant content
     - Ensure each lecture builds upon or complements previous ones
  
  4. Balance and Variety:
     - Mix theoretical and practical lectures
     - Alternate between different learning approaches
     - Create "mini-themes" that combine related topics
     - Include occasional "fun" lectures to maintain engagement

  The lecture Lists are: ${generateClassroomRequestDto.lectures.join(', ')}
  The lecture Ids are: ${lectureIds.join(', ')}. You should select lecture Ids from the lecture ID lists considering the above guidelines.
  Please select and organize lectures to create an engaging and effective learning path that keeps students motivated and interested.
  `,
} as const;
