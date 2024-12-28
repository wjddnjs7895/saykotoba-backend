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
          suggestedReplies: {
            type: 'array',
            description:
              'The list of suggested replies for the user to respond to the conversation response, considering the entire input conversation',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                japanese: {
                  type: 'string',
                  description: 'The suggested reply in Japanese',
                },
                meaning: {
                  type: 'string',
                  description: 'The meaning of the Japanese reply in English',
                },
              },
              required: ['japanese', 'meaning'],
            },
          },
        },
        required: ['response', 'missionResults', 'suggestedReplies'],
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
