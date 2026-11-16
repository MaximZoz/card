/** Запрос, который Sandbox показывает при открытии. В нём есть все поля визитки. */
export const profileDocument = `query {
  profile {
    name
    description
    links {
      title
      url
    }
    skills {
      name
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      url
    }
  }
}
`;
