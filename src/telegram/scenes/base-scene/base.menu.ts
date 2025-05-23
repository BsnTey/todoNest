import { START_SCENE } from '../scene.constants';

export const START = {
  name: '/start',
  scene: START_SCENE,
};

export const ALL_KEYS_MENU_BUTTON = [START];

export const ALL_KEYS_MENU_BUTTON_NAME = ALL_KEYS_MENU_BUTTON.map(
  (item) => item.name,
);
export const getValueKeysMenu = (key: string) =>
  ALL_KEYS_MENU_BUTTON.find((btnObj) => key === btnObj.name)?.scene;
