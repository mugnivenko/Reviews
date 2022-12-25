import { Component, Inject, ViewEncapsulation } from '@angular/core';
import type { OnInit } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import type { NotificationData } from './shared/notification-data.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationComponent implements OnInit {
  icon: string;
  message: string;
  description: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationData) {
    this.icon = data.icon;
    this.message = data.message;
    this.description = data.description;
  }

  ngOnInit(): void {}
}
