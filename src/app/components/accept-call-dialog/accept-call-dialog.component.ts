import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { CallClientService } from 'src/app/services/acs-services/call-client.service';
import { AcsCredentialService } from 'src/app/services/acs-services/acs-cred.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Howl } from 'howler'
import { Router } from '@angular/router';



@Component({
  selector: 'app-accept-call-dialog',
  templateUrl: './accept-call-dialog.component.html',
  styleUrls: ['./accept-call-dialog.component.scss']
})
export class AcceptCallDialogComponent implements OnInit {

  ringing:  Howl = new Howl({
    src: ['src/assets/media/Sound/Ping1.mp3']
  });


  constructor(
    private dialogRef: MatDialogRef<AcceptCallDialogComponent>,
    public callClientService: CallClientService,
    private router: Router,
    public acsCredentialService: AcsCredentialService,
    @Inject(MAT_DIALOG_DATA) public data: {
      
     callerName: String,
     callerAvatar: String;

    },
    
    
  ) { 
    this.callClientService.isNotificationOpened = true;



  }


  //Toggles the visibility of the notification list
  displayDropdown() {
    document.getElementById("dropdown-content")!.classList.toggle("show");
  }



  //Navigate to page for configuring devices
  async acceptCall() {

    this.callClientService.callType = 'callee';

    this.callClientService.isNotificationOpened = false;

    this.dialogRef.close();

      this.router.navigate(['/local-preview']);




  }


  async rejectCall() {

    try {
      this.callClientService.incomingCall!.reject();
    }
    catch (e) {
      console.log(e);
    }
  

    this.callClientService.callHandled = true;
    this.callClientService.isNotificationOpened = false;
    this.dialogRef.close();


  }



  ngOnInit(): void {

   // this.zone.run(() => {
    //  this.ringing.play();
   // });


  }



  // playAudio(){
  //   this.ringing = new Audio();
  //   this.ringing.src = "src/assets/media/Sound/Ping1.mp3";
  //   this.ringing.load();
  //   this.ringing.play();
  // }


  // stopAudio(){
  //   this.ringing.pause();
  // }





}
