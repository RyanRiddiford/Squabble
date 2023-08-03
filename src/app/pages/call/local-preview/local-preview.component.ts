import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  VideoStreamRenderer,
  LocalVideoStream,
} from '@azure/communication-calling';
import { CallClientService } from '../../../services/acs-services/call-client.service';

@Component({
  selector: 'app-call-preview',
  templateUrl: './local-preview.component.html',
  styleUrls: ['./local-preview.component.scss']

})

export class LocalPreviewComponent implements OnInit, OnDestroy {

  //Stores the selected devices for the call
  selectedMic?: AudioDeviceInfo;
  selectedSpeaker?: AudioDeviceInfo;
  selectedCam?: VideoDeviceInfo | null = null;

  closeResult = '';

  private isAcceptingCall: boolean = false;

  joinOrStart?: string;

  constructor(private router: Router,
    public callClientService: CallClientService,
    private modalService: NgbModal,
    private notification: MatSnackBar) {

  }

  //Dispose of any video renders on redirect
  ngOnDestroy(): void {

    var div = document.getElementById('localVideoContainer');
    var video = document.getElementById('video');

    if (this.callClientService.incomingCall !== undefined
      && this.isAcceptingCall == false) {
      this.callClientService.incomingCall.reject();

      this.openNotification("Incoming call timed out...", "error-notification");

    }

    this.callClientService.callHandled = true;

    if (video!) {
      div.removeChild(video);

      this.callClientService.localRender.dispose();

    }

  }

  // Notification
  openNotification(message: string, type: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: [type],
      });
  }

  async ngOnInit() {
    //Enables the confirm button for joining/starting call
    (document.getElementById('confirm-button') as HTMLInputElement).disabled = false;
    //Confirm button label configuration
    if (this.callClientService.callType === "caller")
      this.joinOrStart = "Start";
    else if (this.callClientService.callType === "callee")
      this.joinOrStart = "Join";

    //Ask for device permission
    await this.callClientService.deviceManager.askDevicePermission({ audio: true, video: true });

  }

  //Render the video preview for use whenever asked for
  async createVideoRender() {

    if (this.selectedCam == null) {

      var div = document.getElementById('localVideoContainer');
      var video = document.getElementById('video');

      if (video!) {
        div.removeChild(video);

        this.callClientService.localRender.dispose();

      }

      var placeholder = document.createElement("div");
      placeholder.style.cssText = 'background: black; width: 50%; height: 50%';
      placeholder.id = 'placeholder';

      div.appendChild(placeholder);

      return;
    }

    try {

      this.notification.dismiss();

      var childContainer = document.createElement("div");

      if (this.callClientService.localVideo === undefined) {

        this.callClientService.localVideo = await new LocalVideoStream(this.selectedCam);

        this.callClientService.localRender = await new VideoStreamRenderer(this.callClientService.localVideo);

        this.callClientService.localView = await this.callClientService.localRender.createView();

        var div = document.getElementById('localVideoContainer');

        childContainer.appendChild(this.callClientService.localView.target);

        childContainer.id = 'video';

        //Add new local preview
        div?.appendChild(childContainer);

      }

      else {

        var div = document.getElementById('localVideoContainer');
        var video = document.getElementById('video');

        if (video!) {
          div.removeChild(video);

          this.callClientService.localRender.dispose();

        }

        this.callClientService.localVideo = await new LocalVideoStream(this.selectedCam);

        this.callClientService.localRender = await new VideoStreamRenderer(this.callClientService.localVideo);

        await this.callClientService.localRender.createView().then((localView) => {

          var div = document.getElementById('localVideoContainer');

          var placeholder = document.getElementById('placeholder');

          if (placeholder!) {
            div.removeChild(placeholder);
          }

          childContainer.appendChild(localView.target);

          childContainer.id = 'video';

          //Add new local preview
          div.appendChild(childContainer);

        });

      }

    }
    catch (e) {
      this.openNotification("The selected camera is currently unavailable: \n" + this.selectedCam.name, "error-notification");
      console.log(e);
    }

  }

  //Set the selected devices and navigate to the call page
  confirmCallOptions() {

    //Sets the selected cam.
    if (this.selectedCam !== undefined) {
      this.callClientService.selectedCam = this.selectedCam;
    }

    this.callClientService.callHandled = true;

    this.isAcceptingCall = true;

    this.router.navigate(['/' + this.callClientService.callType]);

  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
