import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ThemeType {
  Dark = 'dark',
  Default = 'default',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private currentTheme: ThemeType = ThemeType.Dark;
  get theme(): ThemeType {
    return this.currentTheme;
  }
  private themeChanged = new BehaviorSubject<ThemeType>(this.currentTheme);


  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.currentTheme = theme as ThemeType;
      // this.toggleTheme().catch((e) => console.error(e));
      this.changeTheme(this.currentTheme).catch((e) => console.error(e));

    }
  }


  private reverseTheme(theme: ThemeType): ThemeType {
    return theme === ThemeType.Dark ? ThemeType.Default : ThemeType.Dark;
  }


  private removeUnusedTheme(theme: ThemeType): void {
    document.documentElement.classList.remove(theme);
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
    }
  }


  public loadTheme(firstLoad = true): Promise<Event> {
    const theme = this.currentTheme;
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<Event>((resolve, reject) => {
      this.loadCss(`${theme}.css`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(this.reverseTheme(theme));
          localStorage.setItem('theme', theme);
          resolve(e);
        },
        (e) => reject(e)
      );
    });
  }


  public toggleTheme(): Promise<Event> {
    this.currentTheme = this.reverseTheme(this.currentTheme);
    this.themeChanged.next(this.currentTheme);
    return this.loadTheme(false);
  }


  public getThemeChanged(): BehaviorSubject<ThemeType> {
    return this.themeChanged;
  }


  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  private changeTheme(currentTheme: ThemeType) {
    this.currentTheme = currentTheme;
    this.themeChanged.next(this.currentTheme);
    return this.loadTheme();
  }
}
