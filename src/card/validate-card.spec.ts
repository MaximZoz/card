import { card } from './card';
import { validateCard } from './validate-card';

describe('validateCard', () => {
  it('принимает визитку из card.ts', () => {
    expect(validateCard(card)).toEqual([]);
  });

  it('отклоняет пустое имя и кривой месяц', () => {
    const broken = {
      ...card,
      name: ' ',
      experience: [{ ...card.experience[0], startedOn: '2020-13', finishedOn: '2019-01' }],
    };

    expect(validateCard(broken)).toEqual([
      'name пустой',
      'experience[0].startedOn должен быть YYYY-MM',
      'experience[0]: конец раньше начала',
    ]);
  });
});
