import { Field, ObjectType } from '@nestjs/graphql';

// Схема GraphQL строится из этих классов (code-first).
// Поля заполняет сервис обычным объектом, поэтому инициализатора в классе нет.

@ObjectType()
export class LinkModel {
  @Field()
  title!: string;

  @Field()
  url!: string;
}

@ObjectType()
export class SkillModel {
  @Field()
  name!: string;
}

@ObjectType()
export class ExperienceModel {
  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  period!: string;

  @Field(() => [String])
  achievements!: string[];
}

@ObjectType()
export class ProjectModel {
  @Field()
  name!: string;

  @Field()
  url!: string;
}

@ObjectType()
export class ProfileModel {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [LinkModel])
  links!: LinkModel[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];
}
