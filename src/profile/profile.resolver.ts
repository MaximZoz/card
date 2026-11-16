import { Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';
import { relationInclude, selectedFieldNames } from './selection';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => ProfileModel)
  profile(@Info() info: GraphQLResolveInfo): Promise<ProfileModel> {
    return this.profiles.get(relationInclude(selectedFieldNames(info)));
  }
}
