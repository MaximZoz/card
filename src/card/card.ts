/**
 * Все факты визитки. Остальной код их только читает.
 * Новый навык, проект, ссылка или место работы — правка этого файла и перезапуск.
 * Месяц пишется как YYYY-MM. finishedOn: null значит «по настоящее время».
 */
export type Card = {
  id: string;
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

export const card: Card = {
  id: 'maxim-zozulya',
  name: 'Максим Зозуля',
  description:
    'Шесть лет пишу TypeScript и C# в компании «Системные Технологии», Калининград. Делаю интерфейсы на Angular и Vue и API на .NET: экраны, фоновые задания, миграции MS SQL и PostgreSQL. Быстро вникаю в новые технологии и спокойно берусь за незнакомый стек: разбираюсь в чужом коде и довожу задачу до кода, тестов и pull request. LLM использую для разбора кода, черновиков тестов и проверки перед ревью.',
  links: [
    { title: 'GitHub', url: 'https://github.com/MaximZoz' },
    { title: 'games', url: 'https://github.com/MaximZoz/games' },
  ],
  skills: [
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'PostgreSQL' },
    { name: 'MS SQL' },
    { name: 'Docker' },
    { name: 'Git' },
    { name: 'C#' },
    { name: '.NET' },
    { name: 'Angular' },
    { name: 'Nx' },
    { name: 'RxJS' },
    { name: 'Vue' },
    { name: 'Vuex' },
    { name: 'Jest' },
    { name: 'SignalR' },
  ],
  experience: [
    {
      company: 'Системные Технологии',
      position: 'Инженер-программист',
      // Месяц из расчёта «шесть лет». Поправь обе даты, если в трудовой иначе.
      startedOn: '2020-01',
      finishedOn: null,
      achievements: [
        'Вёл фронтенд монорепозитория на Angular и Nx: приложения, общие библиотеки, ленивая загрузка',
        'Связал интерфейс с API через OpenAPI и RxJS, обновление экранов через SignalR',
        'Перевёл монорепозиторий на новую мажорную версию Angular и сохранил сборку существующих модулей',
        'Делал расширения мобильного приложения на JavaScript и Vue',
        'На C# и .NET делал API, фоновые задания и миграции MS SQL и PostgreSQL',
        'Покрывал изменения тестами: Jest на фронтенде, xUnit на бэкенде',
      ],
    },
  ],
  projects: [
    { name: 'games', url: 'https://github.com/MaximZoz/games' },
    { name: 'card', url: 'https://github.com/MaximZoz/card' },
  ],
};
