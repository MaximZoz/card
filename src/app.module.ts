import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfig } from './config/configuration';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { profileDocument } from './profile/profile.document';
import { ProfileModule } from './profile/profile.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [AppConfig],
      useFactory: (config: AppConfig): ApolloDriverConfig => ({
        driver: ApolloDriver,
        autoSchemaFile: true,
        sortSchema: true,
        path: config.graphqlPath,
        introspection: true,
        playground: false,
        csrfPrevention: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({
            embed: true,
            document: profileDocument,
          }),
        ],
      }),
    }),
    PrismaModule,
    ProfileModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
