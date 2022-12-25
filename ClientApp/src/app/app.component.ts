import { Component, OnDestroy, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subject, takeUntil } from 'rxjs';

import { Theme } from './theme/shared/theme.enum';
import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  notifier = new Subject();
  public theme?: Theme;

  constructor(
    private overlayContainer: OverlayContainer,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService
      .getTheme()
      .pipe(takeUntil(this.notifier))
      .subscribe((theme) => {
        const oldTheme = this.theme;
        this.theme = theme;
        this.applyThemeOnOverlays(`${theme}-overlay`, `${oldTheme}-overlay`);
      });
  }

  private applyThemeOnOverlays(newThemeClass: string, oldThemeClass?: string) {
    const overlayContainerClasses =
      this.overlayContainer.getContainerElement().classList;
    overlayContainerClasses.add(newThemeClass);
    if (oldThemeClass !== undefined) {
      overlayContainerClasses.remove(oldThemeClass);
    }
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
