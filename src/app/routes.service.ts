import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private previousUrl: string | null = null;

  setPreviousUrl(url: string) {
    this.previousUrl = url;
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }
}
