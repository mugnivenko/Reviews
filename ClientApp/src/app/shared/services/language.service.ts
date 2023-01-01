import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import Cookies from 'js-cookie';

import { Language } from '../enums/language.enum';
import type { AvailableLanguages } from '../models/available-languages.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  language = new BehaviorSubject<string>('');

  constructor() {
    this.setSelectedLanguage();
  }

  availableLanguages = {
    [Language.Ru]: $localize`Russian`,
    [Language.EnUs]: $localize`English`,
  };

  private setSelectedLanguage() {
    const languageCode = Cookies.get('language');
    if (languageCode === undefined) return;
    this.language.next(
      this.availableLanguages[languageCode as AvailableLanguages] ?? ''
    );
  }

  set(code: `${Language}`) {
    Cookies.set('language', code);
    window.location.reload();
  }

  getLanguagesWithCodes() {
    return Object.entries(this.availableLanguages).map(
      ([key, value]) =>
        ({ code: key, name: value } as {
          code: AvailableLanguages;
          name: string;
        })
    );
  }

  getSelectedLanguage() {
    return this.language.asObservable();
  }
}
