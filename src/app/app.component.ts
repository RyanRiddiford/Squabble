import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'Squabble';

  constructor() {
    window.scrollTo(0, 0);
  }
}
