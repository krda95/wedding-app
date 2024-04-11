import { Injectable } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  countdownToDate(date: Date): Observable<{days: number, hours: number, minutes: number, seconds: number}> {
    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const now = new Date();
        const difference = date.getTime() - now.getTime();
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      })
    );
  }

  constructor() { }
}
