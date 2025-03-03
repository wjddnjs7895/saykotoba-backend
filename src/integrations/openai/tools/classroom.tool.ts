export const ClassroomTool = [
  {
    type: 'function',
    function: {
      name: 'createClassroom',
      description:
        'Generate an engaging classroom with specific lectures. Create an interesting learning path by mixing different types of lectures in an engaging way. IMPORTANT: Lectures should NOT be arranged simply by ID or difficulty - create natural connections and maintain student interest through variety.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description:
              'Title of the classroom. Only provide title in the requested language (i.e. en, ko)',
          },
          lectureIds: {
            type: 'array',
            items: {
              type: 'number',
              description:
                'Lecture IDs to be included in the classroom. You should select lecture Ids from the lecture ID lists.',
            },
            minItems: 30,
            maxItems: 100,
          },
        },
        required: ['title', 'lectureIds'],
      },
    },
  } as const,
];
