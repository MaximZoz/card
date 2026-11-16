import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppConfig } from '../config/configuration';

// Клиент Prisma как сервис Nest: подключение открывается со стартом модуля и закрывается с остановкой.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: AppConfig) {
    super({
      // DEBUG_SQL=true печатает каждый SQL-запрос в лог.
      log: config.debugSql ? ['query'] : [],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
