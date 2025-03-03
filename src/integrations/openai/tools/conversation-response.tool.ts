export const ConversationResponseTool = [
  {
    type: 'function',
    function: {
      name: 'generateResponse',
      description:
        'Generate conversation response and check mission completion',
      parameters: {
        type: 'object',
        properties: {
          response: {
            type: 'string',
            description:
              'Natural and engaging conversation response to the user. The response should be in Japanese. (When ai role is teacher, sometimes you can request translation by using required language if mission includes translation) Do not consider the mission too much.',
          },
          meaning: {
            type: 'string',
            description:
              'The meaning of the conversation response only in required language (i.e. en, ko)',
          },
          missionResults: {
            type: 'array',
            description:
              "List of assigned conversation missions and their completion status. Make sure to match the exact mission ID when reporting completion status. Be lenient in your evaluation - if the mission's intent has been addressed even partially, consider it completed.",
            items: {
              type: 'object',
              properties: {
                missionId: {
                  type: 'number',
                  description:
                    'The id of the assigned conversation mission. Must exactly match the original mission ID.',
                },
                mission: {
                  type: 'string',
                  description: 'The assigned conversation mission to complete',
                },
                isCompleted: {
                  type: 'boolean',
                  description:
                    "Indicates whether this specific mission is completed. Be lenient in evaluation and don't be too strict about exact wording or perfect execution.",
                },
              },
              required: ['missionId', 'mission', 'isCompleted'],
            },
          },
        },
        required: ['response', 'meaning', 'missionResults'],
      },
    },
  } as const,
];

export type ConversationResponseToolType = typeof ConversationResponseTool;
export type MissionResultType = {
  missionId: number;
  mission: string;
  isCompleted: boolean;
};
