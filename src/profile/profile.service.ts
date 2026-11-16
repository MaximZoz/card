import { Injectable, NotFoundException } from '@nestjs/common';
import { card } from '../card/card';
import { AppConfig, PeriodLabels } from '../config/configuration';
import { ProfileModel } from './profile.model';
import { ProfileRepository } from './profile.repository';
import { RelationInclude } from './selection';

export function formatPeriod(startedOn: string, finishedOn: string | null, labels: PeriodLabels): string {
  return `${startedOn}${labels.separator}${finishedOn ?? labels.present}`;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly config: AppConfig,
  ) {}

  async get(include: RelationInclude): Promise<ProfileModel> {
    const row = await this.repository.load(card.id, include);
    if (!row) {
      throw new NotFoundException('Профиль не найден. Сид не записал данные.');
    }

    return {
      name: row.name,
      description: row.description,
      links: row.links,
      skills: row.skills,
      experience: row.experience.map((item) => ({
        company: item.company,
        position: item.position,
        period: formatPeriod(item.startedOn, item.finishedOn, this.config.period),
        achievements: item.achievements,
      })),
      projects: row.projects,
    };
  }
}
