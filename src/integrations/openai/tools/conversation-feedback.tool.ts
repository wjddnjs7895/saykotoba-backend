export const ConversationFeedbackTool = [
  {
    type: 'function',
    function: {
      name: 'getConversationFeedback',
      description:
        'Generate feedback for the conversation. Only provide feedback for sentences with actual errors or that could be significantly improved.',
      parameters: {
        type: 'object',
        properties: {
          score: {
            type: 'number',
            description:
              'The score of the conversation from 0 to 100 (100 is the highest score) considering the difficulty level',
            minimum: 0,
            maximum: 100,
          },
          grammar: {
            type: 'array',
            description:
              'Feedback only for sentences with clear grammatical errors',
            items: {
              type: 'object',
              properties: {
                sentence: {
                  type: 'string',
                  description:
                    'The original sentence that contains a grammatical error',
                },
                feedback: {
                  type: 'string',
                  description:
                    'Feedback explaining the grammatical error and correction. Only provide feedback in the requested language (i.e. en, ko)',
                },
              },
              required: ['sentence', 'feedback'],
            },
          },
          betterExpressions: {
            type: 'array',
            description:
              'Feedback only for sentences that could be significantly improved in terms of naturalness or formality',
            items: {
              type: 'object',
              properties: {
                sentence: {
                  type: 'string',
                  description:
                    'The original sentence that needs significant improvement',
                },
                betterExpression: {
                  type: 'string',
                  description:
                    'A significantly better or more natural Japanese expression',
                },
                reading: {
                  type: 'string',
                  description:
                    'How to read the better expression (in hiragana/katakana)',
                },
                feedback: {
                  type: 'string',
                  description:
                    'Explanation of why this expression is significantly better. Only provide feedback in the requested language (i.e. en, ko)',
                },
              },
              required: ['sentence', 'betterExpression', 'reading', 'feedback'],
            },
          },
          difficultWords: {
            type: 'array',
            description:
              'List of notably difficult or important vocabulary words',
            items: {
              type: 'object',
              properties: {
                word: {
                  type: 'string',
                  description: 'The difficult word from the conversation',
                },
                reading: {
                  type: 'string',
                  description: 'How to read the word (in hiragana/katakana)',
                },
                meaning: {
                  type: 'string',
                  description:
                    'The meaning of the word. Only provide meaning in the requested language (i.e. en, ko)',
                },
              },
              required: ['word', 'reading', 'meaning'],
            },
          },
        },
        required: ['score', 'grammar', 'betterExpressions', 'difficultWords'],
      },
    },
  } as const,
];

export type ConversationFeedbackToolType = typeof ConversationFeedbackTool;
