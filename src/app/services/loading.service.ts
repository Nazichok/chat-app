import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCounter = 0;
  private loadingSubject = new BehaviorSubject<number>(this.loadingCounter);
  public loading$ = this.loadingSubject.asObservable().pipe(
    map((loading) => loading > 0)
  );
  public addLoader() {
    this.loadingCounter++;
    this.loadingSubject.next(this.loadingCounter);
  }
  public removeLoader() {
    this.loadingCounter--;
    this.loadingSubject.next(this.loadingCounter);
  }
  constructor() { }
}
