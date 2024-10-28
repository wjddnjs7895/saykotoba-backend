export const ConversationScenarioTool = [
  {
    type: 'function',
    function: {
      name: 'createConversationScenario',
      description:
        'Generate an Japanese conversation scenario with specific situation and learning missions',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          situation: {
            type: 'string',
            description:
              'Detailed description of the conversation situation (including location, context)',
          },
          mission: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specific conversation mission to complete',
            },
            description:
              '2-3 achievable conversation missions for the situation',
          },
        },
        required: ['situation', 'mission'],
        additionalProperties: false,
      },
    },
  } as const,
];
