import { Kind, type GraphQLResolveInfo, type SelectionNode } from 'graphql';

/** Вложенные списки, которые имеют смысл читать отдельной связью. */
export const NESTED_FIELDS = ['links', 'skills', 'experience', 'projects'] as const;

export type NestedField = (typeof NESTED_FIELDS)[number];

export type RelationInclude = Record<NestedField, boolean>;

export function relationInclude(fields: readonly string[]): RelationInclude {
  const requested = new Set(fields);
  return {
    links: requested.has('links'),
    skills: requested.has('skills'),
    experience: requested.has('experience'),
    projects: requested.has('projects'),
  };
}

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
