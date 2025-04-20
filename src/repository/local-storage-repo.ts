/** local storage item name */
export enum LSItemName {
  FileProp = 'FileProp',
  FontSize = 'FontSizeX',
  FullScreenMode = 'FullScreenMode',
  RightColumn = 'RightColumn',
  SyntaxWhenClose = 'SyntaxWhenClose',
  Theme = 'Theme',
}

/** local storage repository */
export class LSRepo {
  static setItem(name: string, value: string
  ) {
    localStorage.setItem(name, value);
  }
  static getItem(name: string) {
    return localStorage.getItem(name);
  }
}
