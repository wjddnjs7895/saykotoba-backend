export const ConversationScenarioTool = [
  {
    type: 'function',
    function: {
      name: 'createConversationScenario',
      description:
        'Generate an Japanese conversation scenario with specific situation and learning missions. IMPORTANT: You must strictly follow the number of missions per difficulty level.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description:
              'Title of the conversation scenario. Only provide title in the requested language (i.e. en, ko)',
          },
          situation: {
            type: 'string',
            description:
              'Detailed description of the conversation situation (including location, context). Only provide description in the requested language (i.e. en, ko)',
          },
          missions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mission: {
                  type: 'string',
                  description:
                    'Specific conversation mission to complete. It must be provided in the requested language (i.e. en, ko)',
                },
              },
              required: ['mission'],
            },
            description: `IMPORTANT: You must strictly follow these exact numbers of missions per difficulty level:
              - beginner(0): EXACTLY 2 missions
              - elementary(1): EXACTLY 3 missions
              - intermediate(2): EXACTLY 4 missions
              - upperIntermediate(3): EXACTLY 5 missions
              - advanced(4): EXACTLY 6 missions
              - challenge(5): EXACTLY 10 missions
              DO NOT generate more or fewer missions than specified.`,
            minItems: 2,
            maxItems: 10,
          },
          difficultyLevel: {
            type: 'number',
            enum: [0, 1, 2, 3, 4, 5],
            description: `Difficulty level of the conversation:
              0: BEGINNER
              1: ELEMENTARY
              2: INTERMEDIATE
              3: UPPER_INTERMEDIATE
              4: ADVANCED
              5: CHALLENGE`,
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
          'difficultyLevel',
          'aiRole',
          'userRole',
        ],
      },
    },
  } as const,
];
