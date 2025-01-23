export const ClassroomTool = [
  {
    type: 'function',
    function: {
      name: 'createClassroom',
      description:
        'Generate a classroom with specific lectures. IMPORTANT: You must strictly include only the lectureIds that is included in the request.',
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
              description: 'Lecture IDs to be included in the classroom',
            },
            minItems: 50,
            maxItems: 200,
          },
        },
        required: ['title', 'lectureIds'],
      },
    },
  } as const,
];
