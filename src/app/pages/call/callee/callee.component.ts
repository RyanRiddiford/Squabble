import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GetAccountDataService } from '../../../services/get-account-data.service';
import {
  VideoStreamRenderer,
  LocalVideoStream
} from '@azure/communication-calling';
import { User } from '../../../types/user';
import { CallClientService } from '../../../services/acs-services/call-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-callee',
  templateUrl: './callee.component.html',
  styleUrls: ['./callee.component.scss']
})
export class CalleeComponent implements OnInit, OnDestroy {

  //The user's account data
  userData: User = new User();

  isInCall: boolean = true;

  readonly callEndedMessage: string = "You have been disconnected from the call";
  isLeftCall?: boolean;

  constructor(
    public callClientService: CallClientService,
    private accountDataService: GetAccountDataService,
    private notification: MatSnackBar
  ) {

  }

  // Notification
  openNotification(message: string, type: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: [type]
      });
  }

  //Leave the call on leaving page
  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    if (this.callClientService.call != null) {
      await this.endCall();
    }
  }

  //Initialise component
  async ngOnInit() {

    //Get the user data
    await this.accountDataService.getCurrentUserData().then((data) => {
      this.userData = data;
    });

    //Render my local data
    var result = await this.renderLocalParticipantContainer();

    if (result == true) {
      //Accept call with my camera
      this.callClientService.call = await this.callClientService.incomingCall?.accept({ videoOptions: { localVideoStreams: [this.callClientService.localVideo!] } });
    }
    //Accept call without my camera
    else {
      this.callClientService.call = await this.callClientService.incomingCall?.accept();
    }

    //Configure events for the call
    await this.configCallEvents();

    //Enable button for leaving call
    (document.getElementById('end-button') as HTMLInputElement).disabled = false;

  }

  //Set up the events for the call on the callee's side
  async configCallEvents() {

    this.callClientService.call?.on("remoteParticipantsUpdated", async (participants) => {

      //Render the added remote participants
      for (let i = 0; i < participants.added.length; i++) {
        this.updateRemoteRenders();
      }

      //Remove renders for the removed remote participants
      for (let i = 0; i < participants.removed.length; i++) {
        this.updateRemoteRenders();
      }

      //Hang up call if the other participant left
      if (this.callClientService.call?.remoteParticipants.length == 0) {

        await this.endCall();

        //Enable button for leaving call
        (document.getElementById('end-button') as HTMLInputElement).disabled = true;

      }

    });

    for (let i = 0; i < this.callClientService.call!.remoteParticipants.length; i++) {

      if (this.callClientService.call!.remoteParticipants[i].videoStreams.length > 0) {

        let camStream = this.callClientService.call!.remoteParticipants[i].videoStreams.find(function (stream) {
          return stream.mediaStreamType === "Video";
        });

        if (camStream !== undefined) {

          camStream.on("isAvailableChanged", async () => {

            this.updateRemoteRenders();

          });

        }

      }

    }

    this.callClientService.call?.on("stateChanged", async () => {

      var span = document.getElementById('call-state');
      if (span != null) {
        span!.innerText = this.callClientService.call!.state;
      }

      if (this.callClientService.call.state === "Disconnected") {
        await this.endCall();
      }

      //Render videos on join
      if (this.callClientService.call?.state == 'Connected') {
        this.isInCall = true;
        this.updateRemoteRenders();
      }

    });

    //Local video streams updated event
    this.callClientService.call?.on("localVideoStreamsUpdated", (streams) => {

    });

  }

  async updateRemoteRenders() {

    var remoteGrid = document.getElementById('remote-participants-wrapper');
    remoteGrid.innerHTML = '';

    for (let i = 0; i < this.callClientService.call!.remoteParticipants.length; i++) {

      if (this.callClientService.call.remoteParticipants[i].displayName === undefined) {
        continue;
      }

      var remoteContainer = document.createElement("div");

      var textContainer = document.createElement("div");

      var remoteName = "<h2 style='color:black'>"
        + this.callClientService.call!.remoteParticipants[i].displayName
        + "</h2>";

      textContainer.innerHTML = remoteName;

      //If the participant has a video stream
      if (this.callClientService.call!.remoteParticipants[i].videoStreams.length > 0) {

        var videoContainer = document.createElement("div");

        //Returns a camera stream if one exists, else leaves variable undefined
        let camStream = this.callClientService.call!.remoteParticipants[i].videoStreams.find(function (s) {
          return s.mediaStreamType === "Video"
        });

        //If a camera stream exists
        if (camStream !== undefined) {

          //If the video source is available
          if (camStream.isAvailable == true) {

            //Append video stream to end of the call's videos array
            this.callClientService.videos!.push(camStream);
            //Append new render of video stream to array of renders for call
            this.callClientService.renders?.push(new VideoStreamRenderer(this.callClientService.videos![this.callClientService.videos!.length - 1]));
            //Append the view of the new video render to the end of the views array for call
            this.callClientService.views?.push(await this.callClientService.renders![this.callClientService.renders!.length - 1].createView({ scalingMode: "Fit" }));

            videoContainer.appendChild(this.callClientService.views[this.callClientService.views.length - 1].target);

            remoteContainer.appendChild(videoContainer);

          }
        }

        remoteContainer.appendChild(textContainer);

        remoteGrid.appendChild(remoteContainer);

      }

    }

  }

  //Leave the call
  async endCall() {

    var remoteGrid = document.getElementById('remote-participants-wrapper');

    try {
      remoteGrid.innerHTML = '';
    }
    catch (e) {
      console.log(e);
    }

    if (this.callClientService.call.state === "Disconnected"
      || this.callClientService.call?.remoteParticipants.length == 0) {

      if (this.callClientService.localVideo != null
        && this.callClientService.localVideo !== undefined) {
        this.callClientService.call.stopVideo(this.callClientService.localVideo);
        if (this.callClientService.localRender != null
          && this.callClientService.localRender !== undefined) {
          this.callClientService.localRender.dispose();
        }

      }

      //Disable button for leaving call
      (document.getElementById('end-button') as HTMLInputElement).disabled = true;

      this.isInCall = false;
      this.isLeftCall = true;

      for (let i = 0; i < this.callClientService.renders.length; i++) {
        if (this.callClientService.renders[i] != null) {
          this.callClientService.renders[i].dispose();
        }

      }

      return;

    }

    if (this.callClientService.localVideo != null
      && this.callClientService.localVideo !== undefined) {
      try {
        await this.callClientService.call.stopVideo(this.callClientService.localVideo);

        for (let i = 0; i < this.callClientService.renders.length; i++) {
          if (this.callClientService.renders[i] != null) {
            this.callClientService.renders[i].dispose();
          }

        }
      }
      catch (e) {
        console.log(e);
      }

      finally {
        //Hang up call
        await this.callClientService.call?.hangUp().then(() => {

          try {
            document.getElementById('local')!.innerHTML = '';
            document.getElementById('remote-participants-wrapper').innerHTML = '';
          }
          catch (e) {
            console.log(e);
          }

        });
        //Dispose of all remote participant video renders
        for (let i = 0; i < this.callClientService.renders.length; i++) {
          if (this.callClientService.renders[i] != null) {
            this.callClientService.renders[i].dispose();
          }

        }

        this.isInCall = false;
        this.isLeftCall = true;

        //Disable button for leaving call
        (document.getElementById('end-button') as HTMLInputElement).disabled = true;

      }

    }

  }

  //Render my local video and display name. Returns true if video render success, else false
  async renderLocalParticipantContainer() {

    let isRendered: boolean = false;

    var localName = "<h2 style='color:black'> You: "
      + this.callClientService.callAgent.displayName
      + "</h2>";

    var textContainer = document.createElement("div");

    textContainer.innerHTML = localName;

    //No video to render. Return.
    if (this.callClientService.selectedCam! === undefined || this.callClientService.selectedCam == null) {

      document.getElementById("local").appendChild(textContainer);

      return isRendered;
    }

    try {
      this.callClientService.localVideo = await new LocalVideoStream(this.callClientService.selectedCam!);

      this.callClientService.localRender = new VideoStreamRenderer(this.callClientService.localVideo);

      this.callClientService.localView = await this.callClientService.localRender.createView({ scalingMode: "Fit", });

      document.getElementById("local").appendChild(textContainer);
      document.getElementById("local").appendChild(this.callClientService.localView.target);

      isRendered = true;

    }
    //If selected video source could not be rendered
    catch (e) {

      this.openNotification("The video source selected is unavailable! Joining call without video...", "error-notification");

      isRendered = false;
    }

    //Always render the display name
    finally {

      return isRendered;
    }

  }

  //Toggle mute of my microphone
  async toggleMute() {
    //If I am muted, unmute me
    if (this.callClientService.call?.isMuted == true) {
      this.callClientService.call.unmute();
      document.getElementById('mute-button')!.innerText = "mic_off";
    }
    //If I am unmuted, mute me
    else if (this.callClientService.call?.isMuted == false) {
      this.callClientService.call.mute();
      document.getElementById('mute-button')!.innerText = "mic_on";
    }

  }

}
