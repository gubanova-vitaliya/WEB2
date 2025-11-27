export const ROUTES = {
  HOME: "/",
  GASES: "/gases",
  REDUX_DEMO: "/redux-demo",
  NOTES: "/notes",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  GASES: "Газы",
  REDUX_DEMO: "Redux Demo",
  NOTES: "Заметки",
};


