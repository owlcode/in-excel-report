import { environment } from './../environments/environment';
import {
  Component,
  ViewEncapsulation,
} from '@angular/core';

declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.addGAScript();
  }

  addGAScript() {
    let gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsId;
    document.head.prepend(gtagScript);
    gtag('config', environment.googleAnalyticsId, { send_page_view: false });
}
}
