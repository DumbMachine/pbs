export enum ShortcutType {
  hint = "hint",
  shortcut = "shortcut",
}
export interface IShortcut {
  title: string;
  type: ShortcutType;
  action: (element: HTMLElement) => void;
  hover?: (element: HTMLElement) => void;
}

export interface INotifcation {
  Primary: string;
  Secondary?: string;
}
