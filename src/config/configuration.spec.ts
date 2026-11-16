import { readConfig } from './configuration';

describe('readConfig', () => {
  it('берёт значения по умолчанию', () => {
    expect(readConfig({})).toMatchObject({
      port: 3000,
      graphqlPath: '/graphql',
      seedOnStart: true,
      debugSql: false,
      period: { present: 'по настоящее время' },
    });
  });

  it('отклоняет мусор вместо флага', () => {
    expect(() => readConfig({ SEED_ON_START: 'yes' })).toThrow('SEED_ON_START');
  });
});
