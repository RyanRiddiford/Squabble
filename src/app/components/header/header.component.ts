////import { Component, OnInit } from '@angular/core';
////import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
////import { Observable } from 'rxjs';
////import { map, shareReplay } from 'rxjs/operators';
////import { Router } from '@angular/router';
////import { CallClientService } from '../../services/acs-services/call-client.service';

////@Component({
////  selector: 'app-header',
////  templateUrl: './header.component.html',
////  styleUrls: ['./header.component.scss']
////})

////export class HeaderComponent implements OnInit {


////  isIncomingCall: boolean = false;

////  constructor(private breakpointObserver: BreakpointObserver,
////    private router: Router,
////    private callClientService: CallClientService) {

////    console.log("inside headercomponent constructor!");

////  }



////  async ngOnInit() {

////    await this.setupNotificationEvents();
////     console.log("header component oninit end?");

////  }

////  //Notifies user of events and allows them to act upon them
////  private async setupNotificationEvents() {


////    //Accept or reject a call
////    this.callClientService.callAgent.on("incomingCall", (incomingCallEvent) => {

////      console.log("header component incoming call event!");

////      //Reject the call if I am already in one
////      if (this.callClientService.call === undefined
////        || this.callClientService.call === null) {
////        incomingCallEvent.incomingCall.reject();
////      }


////      //Render the incoming call notifier
////      this.isIncomingCall = true;



////      //If the user chooses to accept a call
////      document.getElementById('accept')?.onclick == ( async () => {
////        //Accepting a call brings them to the new tab local preview page, then sends them to the call
////        this.callClientService.call = await incomingCallEvent.incomingCall.accept();
////      });
  

     


      

   


////      //If the user chooses to reject a call
////      document.getElementById('reject')?.onclick == function () {
////      //Rejecting a call notifies the caller of the rejection,removes the notification, and closes the dropdown
////        incomingCallEvent.incomingCall.reject();
////      };



////    });




////  }


////  //Toggles the visibility of the notification list
////  displayDropdown() {
////    document.getElementById("dropdown-content")!.classList.toggle("show");
////  }








////}
