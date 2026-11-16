import { Kind } from 'graphql';
import { relationInclude, selectedFieldNames } from './selection';

describe('relationInclude', () => {
  it('не читает связи, которых нет в запросе', () => {
    expect(relationInclude(['name', 'description'])).toEqual({
      links: false,
      skills: false,
      experience: false,
      projects: false,
    });
  });

  it('читает только запрошенный список', () => {
    expect(relationInclude(['name', 'skills'])).toMatchObject({ skills: true, projects: false });
  });
});

describe('selectedFieldNames', () => {
  it('собирает поля запроса, включая inline-фрагмент', () => {
    const info = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              { kind: Kind.FIELD, name: { value: 'name' } },
              {
                kind: Kind.INLINE_FRAGMENT,
                selectionSet: {
                  selections: [{ kind: Kind.FIELD, name: { value: 'skills' } }],
                },
              },
            ],
          },
        },
      ],
    };

    expect(selectedFieldNames(info as never)).toEqual(['name', 'skills']);
  });
});
