export const ConversationScenarioTool = [
  {
    type: 'function',
    function: {
      name: 'createConversationScenario',
      description:
        'Generate an Japanese conversation scenario with specific situation and learning missions',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Title of the conversation scenario',
          },
          situation: {
            type: 'string',
            description:
              'Detailed description of the conversation situation (including location, context)',
          },
          missions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mission: {
                  type: 'string',
                  description: 'Specific conversation mission to complete',
                },
                isCompleted: {
                  type: 'boolean',
                  description: 'Mission completion status',
                  default: false,
                },
              },
              required: ['mission', 'isCompleted'],
            },
            description: `Number of missions per difficulty level:
              - beginner: 2 missions
              - elementary: 3 missions
              - intermediate: 4 missions
              - upperIntermediate: 5 missions
              - advanced: 6 missions
              - challenge: 10 missions`,
            minItems: 2,
            maxItems: 10,
          },
          difficulty: {
            type: 'string',
            description:
              'Difficulty level of the conversation (beginner, elementary, intermediate, upperIntermediate, advanced, challenge)',
            enum: [
              'beginner',
              'elementary',
              'intermediate',
              'upperIntermediate',
              'advanced',
              'challenge',
            ],
          },
          aiRole: {
            type: 'string',
            description: 'The role that AI will play in the conversation',
          },
          userRole: {
            type: 'string',
            description: 'The role that user will play in the conversation',
          },
        },
        required: [
          'title',
          'situation',
          'missions',
          'difficulty',
          'aiRole',
          'userRole',
        ],
      },
    },
  } as const,
];
