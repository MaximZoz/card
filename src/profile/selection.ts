import { Kind, type GraphQLResolveInfo, type SelectionNode } from 'graphql';

// Вложенные списки профиля. Этот массив — единственное место, где они перечислены:
// из него выводятся и тип флагов, и их разбор в relationInclude.
export const NESTED_FIELDS = ['links', 'skills', 'experience', 'projects'] as const;

export type NestedField = (typeof NESTED_FIELDS)[number];

export type RelationInclude = Record<NestedField, boolean>;

// Какие связи запрошены клиентом. Флаг true только у полей, названных в запросе.
export function relationInclude(fields: readonly string[]): RelationInclude {
  const requested = new Set(fields);
  const include = {} as RelationInclude;
  for (const field of NESTED_FIELDS) {
    include[field] = requested.has(field);
  }
  return include;
}

// Имена полей верхнего уровня внутри profile { ... }, с разворотом inline-фрагментов.
export function selectedFieldNames(info: Pick<GraphQLResolveInfo, 'fieldNodes'>): string[] {
  const names: string[] = [];
  for (const node of info.fieldNodes) {
    collect(node.selectionSet?.selections, names);
  }
  return names;
}

function collect(selections: readonly SelectionNode[] | undefined, into: string[]): void {
  for (const selection of selections ?? []) {
    if (selection.kind === Kind.FIELD) {
      into.push(selection.name.value);
      continue;
    }
    if (selection.kind === Kind.INLINE_FRAGMENT) {
      collect(selection.selectionSet.selections, into);
    }
  }
}
