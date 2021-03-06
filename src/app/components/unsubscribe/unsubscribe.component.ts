import { takeUntil } from 'rxjs/operators';
import { interval, Subscription, Subject, fromEvent } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit {


  subscriptionsActive = false;
  subscriptions: Subscription[] = [];
  unsubscribeAll$: Subject<any> = new Subject();
  intervalSubscription: Subscription = null;
  constructor() { }

  ngOnInit() {
    this.checkSubscriptions();
  }

  checkSubscriptions() {
    this.intervalSubscription = interval(100).subscribe(() => {
      let active = false;
      this.subscriptions.forEach((s) => {
        if (!s.closed) {
          active = true;
        }
      })
      this.subscriptionsActive = active;
    })
  }

  subscribe() {
    const subscription1 = interval(100)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe((i) => { console.log(i); })
    const subscription2 = fromEvent(document, 'mousemove')
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe((e) => console.log(e))

    this.subscriptions.push(subscription1);
    this.subscriptions.push(subscription2);
  }

  unsubscribe() {
    this.unsubscribeAll$.next();
  }

  ngOnDestroy() {
    if (this.intervalSubscription != null) {
      this.intervalSubscription.unsubscribe();
    }
    console.log('destroy')
    this.unsubscribeAll$.next();

  }

}
