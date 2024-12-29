export const ConversationHintTool = [
  {
    type: 'function',
    function: {
      name: 'generateHints',
      description: 'Generate conversation hints',
      parameters: {
        type: 'object',
        properties: {
          hints: {
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
                  description:
                    'The meaning of the Japanese reply in required language (i.e. en, ko)',
                },
              },
              required: ['japanese', 'meaning'],
            },
          },
        },
        required: ['hints'],
      },
    },
  } as const,
];

export type ConversationHintToolType = typeof ConversationHintTool;
