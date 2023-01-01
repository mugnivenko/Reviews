import { Injectable } from '@angular/core';

import type { IndividualConfig } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

import { NotificationModule } from './notification.module';

import { NotificationData } from './shared/notification-data.model';

@Injectable({
  providedIn: NotificationModule,
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  public error({ message, description }: Partial<NotificationData>) {
    this.toastr.error(description, message);
  }
}
