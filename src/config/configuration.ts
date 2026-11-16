import { Injectable } from '@nestjs/common';

export type PeriodLabels = {
  separator: string;
  present: string;
};

/** Текст периода. Меняется здесь, в базу не пишется. */
export const periodText: PeriodLabels = {
  separator: ' — ',
  present: 'по настоящее время',
};

export type AppSettings = {
  port: number;
  graphqlPath: string;
  seedOnStart: boolean;
  debugSql: boolean;
  period: PeriodLabels;
};

export function readConfig(env: NodeJS.ProcessEnv, period: PeriodLabels = periodText): AppSettings {
  return {
    port: readPort(env.PORT),
    graphqlPath: readPath(env.GRAPHQL_PATH),
    seedOnStart: readFlag(env.SEED_ON_START, 'SEED_ON_START', true),
    debugSql: readFlag(env.DEBUG_SQL, 'DEBUG_SQL', false),
    period,
  };
}

@Injectable()
export class AppConfig {
  readonly port: number;
  readonly graphqlPath: string;
  readonly seedOnStart: boolean;
  readonly debugSql: boolean;
  readonly period: PeriodLabels;

  constructor() {
    const config = readConfig(process.env);
    this.port = config.port;
    this.graphqlPath = config.graphqlPath;
    this.seedOnStart = config.seedOnStart;
    this.debugSql = config.debugSql;
    this.period = config.period;
  }
}

function readPort(value: string | undefined): number {
  const port = Number(value ?? 3000);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT должен быть целым числом от 1 до 65535');
  }
  return port;
}

function readPath(value: string | undefined): string {
  const path = value ?? '/graphql';
  if (!path.startsWith('/')) {
    throw new Error('GRAPHQL_PATH должен начинаться с /');
  }
  return path;
}

function readFlag(value: string | undefined, name: string, fallback: boolean): boolean {
  const raw = value ?? (fallback ? 'true' : 'false');
  if (raw !== 'true' && raw !== 'false') {
    throw new Error(`${name} принимает только true или false`);
  }
  return raw === 'true';
}
