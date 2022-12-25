import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { MatSnackBarConfig } from '@angular/material/snack-bar';

import { NotificationComponent } from './notification.component';
import { NotificationData } from './shared/notification-data.model';

import { NotificationModule } from './notification.module';

@Injectable({
  providedIn: NotificationModule,
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  getConfig(panelClassSuffix: string): MatSnackBarConfig<NotificationData> {
    return {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: `snack-bar-${panelClassSuffix}`,
    };
  }

  public error({
    message,
    description,
  }: {
    message: string;
    description?: string;
  }) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: { icon: 'error', message, description },
      panelClass: ['snack-bar'],
      ...this.getConfig('error'),
    });
  }
}
