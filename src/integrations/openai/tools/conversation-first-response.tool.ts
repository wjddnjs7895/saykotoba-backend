export const ConversationFirstResponseTool = [
  {
    type: 'function',
    function: {
      name: 'generateFirstResponse',
      description: 'Generate first message',
      parameters: {
        type: 'object',
        properties: {
          response: {
            type: 'string',
            description:
              'The first message in Japanese that AI role play will say',
          },
          meaning: {
            type: 'string',
            description:
              'The meaning of the first response only in required language (i.e. en, ko)',
          },
        },
        required: ['response', 'meaning'],
      },
    },
  } as const,
];

export type ConversationFirstResponseToolType =
  typeof ConversationFirstResponseTool;
