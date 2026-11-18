export interface TimberScene {
  id: string;
  subject: string;
  title: string;
  heroText: string;
  description: string;
}

export const timberScenes: TimberScene[] = [];

export const replaceTimberScenes = (scenes: TimberScene[]): void => {
  timberScenes.splice(0, timberScenes.length, ...scenes);
};
