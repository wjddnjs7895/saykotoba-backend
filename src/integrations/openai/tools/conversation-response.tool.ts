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
            description: 'The conversation response to the user',
          },
          missionResults: {
            type: 'array',
            description:
              'List of assigned conversation missions and their completion status',
            items: {
              type: 'object',
              properties: {
                missionId: {
                  type: 'number',
                  description: 'The id of the assigned conversation mission',
                },
                mission: {
                  type: 'string',
                  description: 'The assigned conversation mission to complete',
                },
                isCompleted: {
                  type: 'boolean',
                  description:
                    'Indicates whether this specific mission is completed',
                },
              },
              required: ['missionId', 'mission', 'isCompleted'],
            },
          },
        },
        required: ['response', 'missionResults'],
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
