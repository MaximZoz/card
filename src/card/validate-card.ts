import { Card } from './card';

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

// Проверяет карточку перед записью в базу и возвращает список понятных ошибок.
// Пустой список значит, что данные корректны.
export function validateCard(value: Card): string[] {
  const errors: string[] = [];

  required(errors, value.id, 'id');
  required(errors, value.name, 'name');
  required(errors, value.description, 'description');

  value.links.forEach((link, index) => {
    required(errors, link.title, `links[${index}].title`);
    https(errors, link.url, `links[${index}].url`);
  });

  const skillNames = new Set<string>();
  value.skills.forEach((skill, index) => {
    required(errors, skill.name, `skills[${index}].name`);
    unique(errors, skillNames, skill.name, `skills[${index}].name`);
  });

  value.experience.forEach((job, index) => {
    const path = `experience[${index}]`;
    required(errors, job.company, `${path}.company`);
    required(errors, job.position, `${path}.position`);
    month(errors, job.startedOn, `${path}.startedOn`);
    if (job.finishedOn !== null) {
      month(errors, job.finishedOn, `${path}.finishedOn`);
    }
    if (job.finishedOn !== null && job.finishedOn < job.startedOn) {
      errors.push(`${path}: конец раньше начала`);
    }
    job.achievements.forEach((item, achievement) => {
      required(errors, item, `${path}.achievements[${achievement}]`);
    });
  });

  const projectNames = new Set<string>();
  value.projects.forEach((project, index) => {
    required(errors, project.name, `projects[${index}].name`);
    unique(errors, projectNames, project.name, `projects[${index}].name`);
    https(errors, project.url, `projects[${index}].url`);
  });

  return errors;
}

function required(errors: string[], value: string, path: string): void {
  if (value.trim() === '') {
    errors.push(`${path} пустой`);
  }
}

function https(errors: string[], value: string, path: string): void {
  if (!value.startsWith('https://')) {
    errors.push(`${path} должен начинаться с https://`);
  }
}

function month(errors: string[], value: string, path: string): void {
  if (!MONTH.test(value)) {
    errors.push(`${path} должен быть YYYY-MM`);
  }
}

function unique(errors: string[], seen: Set<string>, value: string, path: string): void {
  if (seen.has(value)) {
    errors.push(`${path} повторяется: ${value}`);
  }
  seen.add(value);
}
