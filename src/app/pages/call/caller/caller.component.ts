import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { CallClientService } from '../../../services/acs-services/call-client.service';
import { GetAccountDataService } from '../../../services/get-account-data.service';
import {
  VideoStreamRenderer,
  LocalVideoStream,
  StartCallOptions
} from '@azure/communication-calling';
import { User } from '../../../types/user';
import { ChannelService } from '../../../services/squabble-channel.service';
import { ChannelMemberInfo } from '../../../types/channel-member-info';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-caller',
  templateUrl: './caller.component.html',
  styleUrls: ['./caller.component.scss']
})
//The caller's component.
export class CallerComponent implements OnInit, OnDestroy {

  //The user's account data
  userData: User = new User();
  //Call placement options
  placeCallOptions?: StartCallOptions;
  //Selected channel members to call
  channelContacts?: ChannelMemberInfo[];

  activeParticipants: ChannelMemberInfo[] = [];
  absentParticipants: ChannelMemberInfo[] = [];

  myRole?: string;

  isAdmin: boolean = false;
  isOwner: boolean = false;

  isInCall: boolean = true;

  participantToKick?: ChannelMemberInfo | null;
  participantToAdd?: ChannelMemberInfo | null;

  closeResult = '';

  readonly callEndedMessage: string = "You have been disconnected from the call";
  isLeftCall?: boolean;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private callClientService: CallClientService,
    private accountDataService: GetAccountDataService,
    private channelService: ChannelService,
    private modalService: NgbModal,
    private notification: MatSnackBar
  ) {

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

    await this.fetchConfigCallIds();
  }

  //Retrieves the callee ids, then starts the call
  async fetchConfigCallIds() {
    //Get channel members and work out role privileges
    if (this.callClientService.isFriendCall == false) {
      //Get channel members to call
      this.channelService.getMemberAcsIds(this.callClientService.channelId!).subscribe((async idList => {

        this.channelContacts = idList;
        this.activeParticipants = idList;

        for (let i = 0; i < this.channelContacts!.length!; i++) {
          if (this.channelContacts![i].acsId == this.userData.communicationUserId) {
            this.myRole = this.channelContacts![i].role;
            this.channelContacts?.splice(i, 1);
          }

          //If I am an admin, remove the admins and owner from the call members lists
          if (this.myRole == "Admin") {

            this.activeParticipants?.forEach((element, index) => {

              if (element.role == "Admin" || element.role == "Owner") {
                this.activeParticipants?.splice(index, 1);

              }

            });
            this.isAdmin = true;
          }
          //If I am the owner
          else if (this.myRole == "Owner") {
            this.isOwner = true;
          }

        }

        await this.startCall();
      }));
    } else if (this.callClientService.isFriendCall) {
      await this.startCall();
    }
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

  //Initiate the call with specified friend/channel
  async startCall() {

    //Need contacts selected to start call
    if (this.channelContacts === undefined
      && this.callClientService.isFriendCall == false) {
      this.openNotification("At least one contact must be selected for the call!", "error-notification");
      return;
    }

    //If no other call exists, start a call
    if (this.callClientService.call?.state! == 'Disconnected'
      || this.callClientService.call === undefined
      || this.callClientService.call === null) {

      //Render the local video and display name
      var isRendered = await this.renderLocalParticipantContainer();

      //Call the friend for a 1-on-1 call
      if (this.callClientService.isFriendCall == true
        && this.callClientService.friendAcsId !== undefined) {

        //Start the 1-on-1 call with local video stream
        if (this.callClientService.selectedCam! !== undefined
          && isRendered == true) {

          //Register your video to call
          this.placeCallOptions = { videoOptions: { localVideoStreams: [this.callClientService.localVideo] } };

          //Start the call alongside your registered video
          this.callClientService.call = (await this.callClientService.callAgent!).startCall([{ communicationUserId: this.callClientService.friendAcsId }], this.placeCallOptions);
        }
        //Start call without local video stream
        else {
          //Start a 1-on-1 call with no registered video
          this.callClientService.call = (await this.callClientService.callAgent!).startCall([{ communicationUserId: this.callClientService.friendAcsId }]);
        }
      }
      //Call the server channel
      else {

        //Start call with local video stream
        if (this.callClientService.selectedCam! !== undefined
          && isRendered == true) {

          //Register your video to call
          this.placeCallOptions = { videoOptions: { localVideoStreams: [this.callClientService.localVideo] } };

          //Start the call by calling the first participant, alongside your registered video
          this.callClientService.call = (await this.callClientService.callAgent!).startCall([{ communicationUserId: this.channelContacts![0].acsId }], this.placeCallOptions);
        }
        //Start call without local video stream
        else {
          //Start a group call with just the first participant selected and no registered video
          this.callClientService.call = (await this.callClientService.callAgent!).startCall([{ communicationUserId: this.channelContacts![0].acsId }]);
        }
        this.isInCall = true;

        //Call the remaining selected participants
        for (let i = 1; i < this.channelContacts!.length; i++) {
          if (this.userData.communicationUserId != this.channelContacts![i].acsId) {
            this.callClientService.call.addParticipant({ communicationUserId: this.channelContacts![i].acsId });
          }
        }

        //Copy called participants into another array
        this.activeParticipants = this.channelContacts;

      }

      //Update the remote video renders when changes occur for a participant's video stream
      for (let participant of this.callClientService.call.remoteParticipants) {
        participant.on("stateChanged", async () => {
          if (participant.state === "Connected") {
            await this.callClientService.delay(500).then(async () => this.updateRemoteRenders());
          }
        });
      }
    }
    //Deny a new call if one already exists
    else {
      this.openNotification("A call already exists!", "error-notification");
      return;
    }

    //Configure call events for the started call
    await this.configCallEvents();

    //Enable button for ending call
    (document.getElementById('end-button') as HTMLInputElement).disabled = false;
  }

  //End the call
  async endCall() {
    var remoteGrid = document.getElementById('remote-participants-wrapper');

    //Handles cleanup of call if I have been disconnected from the call already
    if (this.callClientService.call.state === "Disconnected"
      || this.callClientService.call.remoteParticipants.length == 0) {

      this.isInCall = false;
      this.isLeftCall = true;

      if (this.callClientService.localVideo!) {
        try {
          this.callClientService.call.stopVideo(this.callClientService.localVideo);

          this.callClientService.localRender.dispose();

          for (let i = 0; i < this.callClientService.renders.length; i++) {
            if (this.callClientService.renders[i] != null) {
              this.callClientService.renders[i].dispose();
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      //Disable button for leaving call
      (document.getElementById('end-button') as HTMLInputElement).disabled = true;

      remoteGrid.innerHTML = '';
      document.getElementById('local').innerHTML = '';

      return;
    }

    if (this.callClientService.localVideo!) {
      try {
        await this.callClientService.call.stopVideo(this.callClientService.localVideo);
      } catch (e) {
        console.log(e);
      }
    }

    try {
      for (let render of this.callClientService.renders) {
        render.dispose();
      }
    } catch (e) {
      console.log(e);
    }

    //Hang up call
    await this.callClientService.call!.hangUp({ forEveryone: true }).then(() => {
      this.isInCall = false;
      this.isLeftCall = true;
    });

    try {
      //Dispose of all remote participant video renders
      for (let i = 0; i < this.callClientService.renders.length; i++) {
        if (this.callClientService.renders[i] != null) {
          this.callClientService.renders[i].dispose();
        }
      }
    } catch (e) {
      console.log(e);
    }

    remoteGrid.innerHTML = '';
    document.getElementById('local').innerHTML = '';

    //Disable button for leaving call
    (document.getElementById('end-button') as HTMLInputElement).disabled = true;
  }

  //Set up the events for the call on the caller's side
  async configCallEvents() {

    this.callClientService.call?.on("remoteParticipantsUpdated", async (participants) => {

      //Hang up call if the other participant left
      if (this.callClientService.call?.remoteParticipants.length == 0) {
        await this.endCall();
      }

      //Render the added remote participants
      for (let i = 0; i < participants.added.length; i++) {
        this.updateRemoteRenders();
      }

      //Remove renders for the removed remote participants
      for (let i = 0; i < participants.removed.length; i++) {
        this.updateRemoteRenders();
      }
    });

    //Notifies view of the call connection's change of state
    this.callClientService.call?.on("stateChanged", async () => {
      var span = document.getElementById('call-state');
      span!.innerText = this.callClientService.call!.state;

      //Render videos on join
      if (this.callClientService.call?.state == 'Connected') {
        this.isInCall = true;
        this.updateRemoteRenders();
      }
    });
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
      this.openNotification("The video source selected is unavailable! Starting call without video...", "error-notification");
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

  //Kick a selected participant
  async kickParticipant() {
    if (this.participantToKick !== undefined && this.participantToKick?.acsId != this.userData.communicationUserId
      && this.participantToKick != null) {
      await this.callClientService.call!.removeParticipant({ communicationUserId: this.participantToKick!.acsId });
      this.activeParticipants?.forEach((element, index) => {

        if (element.acsId == this.participantToKick?.acsId) {
          let deletedElement = this.activeParticipants.splice(index, 1);
          if (this.absentParticipants.length == 0) {
            this.absentParticipants[0] = deletedElement[0];
          } else {
            this.absentParticipants!.push.apply(deletedElement[0]);
          }
          this.participantToKick = null;
          this.changeDetection.detectChanges();
        }
      });
    }
  }

  //Add a selected participant
  async addParticipant() {
    //Block normal members from kicking privileges
    if (this.isAdmin == false && this.isOwner == false) {
      this.openNotification("Only admins and the owner can kick participants!", "error-notification");
      return;
    }

    if (this.participantToAdd !== undefined && this.participantToAdd?.acsId != this.userData.communicationUserId
      && this.participantToAdd != null) {
      var participant = await this.callClientService.call!.addParticipant({ communicationUserId: this.participantToAdd!.acsId });

      //Update the view when the added participant joins the call
      participant.on("stateChanged", () => {
        if (participant.state === "Connected") {
          this.updateRemoteRenders();
        }
      });

      this.absentParticipants?.forEach((element, index) => {
        if (element.acsId == this.participantToAdd?.acsId) {
          let deletedElement = this.absentParticipants!.splice(index, 1);
          if (this.activeParticipants.length == 0) {
            this.activeParticipants[0] = deletedElement[0];
          } else {
            this.activeParticipants!.push.apply(deletedElement[0]);
          }
          this.participantToAdd = null;
          this.changeDetection.detectChanges();
        }
      });
    }
  }
}
