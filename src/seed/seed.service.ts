import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { card } from '../card/card';
import { validateCard } from '../card/validate-card';
import { AppConfig } from '../config/configuration';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfig,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.config.seedOnStart) {
      this.logger.log('Сид выключен');
      return;
    }

    const errors = validateCard(card);
    if (errors.length > 0) {
      throw new Error(`src/card/card.ts:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { id: card.id },
        create: { id: card.id, name: card.name, description: card.description },
        update: { name: card.name, description: card.description },
      });

      await tx.link.deleteMany({ where: { profileId: card.id } });
      await tx.skill.deleteMany({ where: { profileId: card.id } });
      await tx.experience.deleteMany({ where: { profileId: card.id } });
      await tx.project.deleteMany({ where: { profileId: card.id } });

      await tx.link.createMany({
        data: card.links.map((item, sortOrder) => ({
          profileId: card.id,
          title: item.title,
          url: item.url,
          sortOrder,
        })),
      });
      await tx.skill.createMany({
        data: card.skills.map((item, sortOrder) => ({
          profileId: card.id,
          name: item.name,
          sortOrder,
        })),
      });
      await tx.experience.createMany({
        data: card.experience.map((item, sortOrder) => ({
          profileId: card.id,
          company: item.company,
          position: item.position,
          startedOn: item.startedOn,
          finishedOn: item.finishedOn,
          achievements: item.achievements,
          sortOrder,
        })),
      });
      await tx.project.createMany({
        data: card.projects.map((item, sortOrder) => ({
          profileId: card.id,
          name: item.name,
          url: item.url,
          sortOrder,
        })),
      });
    });

    this.logger.log(`Сид записал профиль «${card.name}»`);
  }
}
