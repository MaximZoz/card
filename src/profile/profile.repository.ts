import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RelationInclude } from './selection';

const order = { orderBy: { sortOrder: 'asc' as const } };

export type ProfileRow = {
  name: string;
  description: string;
  links: { title: string; url: string }[];
  skills: { name: string }[];
  experience: {
    company: string;
    position: string;
    startedOn: string;
    finishedOn: string | null;
    achievements: string[];
  }[];
  projects: { name: string; url: string }[];
};

type FullRow = Prisma.ProfileGetPayload<{
  include: { links: true; skills: true; experience: true; projects: true };
}>;

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async load(id: string, include: RelationInclude): Promise<ProfileRow | null> {
    const row = (await this.prisma.profile.findUnique({
      relationLoadStrategy: 'join',
      where: { id },
      include: {
        links: include.links ? order : false,
        skills: include.skills ? order : false,
        experience: include.experience ? order : false,
        projects: include.projects ? order : false,
      },
    })) as FullRow | null;

    if (!row) {
      return null;
    }

    // Связь читается только если include для неё включён тем же флагом.
    return {
      name: row.name,
      description: row.description,
      links: include.links ? row.links.map((item) => ({ title: item.title, url: item.url })) : [],
      skills: include.skills ? row.skills.map((item) => ({ name: item.name })) : [],
      experience: include.experience
        ? row.experience.map((item) => ({
            company: item.company,
            position: item.position,
            startedOn: item.startedOn,
            finishedOn: item.finishedOn,
            achievements: item.achievements,
          }))
        : [],
      projects: include.projects ? row.projects.map((item) => ({ name: item.name, url: item.url })) : [],
    };
  }
}
