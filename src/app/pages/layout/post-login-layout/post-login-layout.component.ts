import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CallClientService } from '../../../services/acs-services/call-client.service';
import { ChatClientService } from '../../../services/acs-services/chat-client.service';
import { SquabbleAccountService } from '../../../services/squabble-account.service';
import {SquabbleAuthService} from "../../../services/squabble-auth.service";

@Component({
  selector: 'app-layout',
  templateUrl: './post-login-layout.component.html',
  styleUrls: ['./post-login-layout.component.scss'],
})
export class PostLoginLayoutComponent implements OnInit, AfterViewChecked {
  isExpanded = false;
  element!: HTMLElement;
  faBars = faBars;
  slideOpen: any = false;
  avatarUrl: string = '/assets/images/default-avatar.jpeg';
  title: string = '';
  ringing: any;

  @Input() state: 'open' | 'close' = 'close';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    public callClientService: CallClientService,
    public chatClientService: ChatClientService,
    private changeDetector: ChangeDetectorRef,
    private squabbleAccountService: SquabbleAccountService,
    private squabbleAuthService: SquabbleAuthService
  ) {
    this.subscribeToAccountData();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  async ngOnInit() {
    this.squabbleAccountService.refreshAccountData();
  }

  open() {
    this.state = 'open';
  }

  close() {
    this.state = 'close';
  }

  subscribeToAccountData() {
    this.squabbleAccountService.accountData.subscribe((data) => {
      if (data.avatar) {
        this.avatarUrl = data.avatar;
      }
    });
  }

  logout() {
    this.squabbleAuthService.logout();
  }

  setHeader() {
    let path = this.router.url.split('/')[1];
    this.title = decodeURIComponent(path);
  }

  toggleState() {
    this.state === 'open' ? this.close() : this.open();
  }

  toggleActive(event: any) {
    event.preventDefault();

    if (this.element !== undefined) {
      this.element.style.backgroundColor = 'white';
    }

    const target = event.currentTarget;
    target.style.backgroundColor = '#99DAFF';
    this.element = target;
  }

  //Navigates to a new tab for a local preview of the specified call type
  callType(callType: string) {
    this.callClientService.callType = callType;
    this.router.navigate(['/local-preview']);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

}
