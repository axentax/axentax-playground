export const global = {
  title: 'Axentax',
  dualLength: 3,
  defaultEditorFontSize: 14,
}

export enum Platform {
  electron,
  browser
}

export const PlatformConfiguration = {
  Platform: Platform.browser,
  title: global.title + ' playground version1.1',
  assetsPath: './assets',

  defaultRightColumnWidth: 410 // 414
}
