import { CharacterEntity } from '../entity/character.entity';

export const getCharacteristicString = (characterInfo: CharacterEntity) => {
  const { name, age, gender, job, personality, characteristics, description } =
    characterInfo;
  return `This character's Information is 
  - name: ${name}
  - age: ${age} years old
  - gender: ${gender}
  - job: ${job}
  - personality: ${personality}
  - characteristics: ${characteristics.join(', ')}
  - description: ${description}`;
};
