import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  CallClient,
  DeviceManager,
  IncomingCall,
  LocalVideoStream,
  RemoteVideoStream,
  VideoDeviceInfo,
  VideoStreamRenderer,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { User } from '../../types/user';
import { AcsCredentialService } from './acs-cred.service';
import { AcceptCallDialogComponent } from '../../components/accept-call-dialog/accept-call-dialog.component';
import { SquabbleAccountService } from '../squabble-account.service';

//Singleton service for the ACS calling functionality
@Injectable({
  providedIn: 'root',
})
export class CallClientService {

  //The channel id to denote the potential channel members/friend to call
  channelId: any;
  //Storage of the logged in user's data
  userData!: User;
  //The call client
  callClient!: CallClient;
  //The call being processed. Can use the call agent calls array instead for multiple calls management
  call: Call | undefined;
  //Used for managing ACS calls. Only one can exist at any point for a user
  callAgent: CallAgent;

  //Flags if the call client service has finished setup
  isLoaded: boolean = false;
  //Stores the incoming call during an incoming call event
  incomingCall?: IncomingCall | undefined = undefined;
  //The friend's acs id to use to call
  friendAcsId?: string;
  //Flags whether or not the user started or ended the currently processing call
  callType?: string;
  //Flags if the call has been finished up
  callHandled: boolean = false;

  //Device management properties
  deviceManager!: DeviceManager;
  mics: Array<AudioDeviceInfo> = [];
  speakers: Array<AudioDeviceInfo> = [];
  cameras: Array<VideoDeviceInfo> = [];

  //Video objects for remote participant videos in a call
  views: Array<VideoStreamRendererView> = [];
  renders: Array<VideoStreamRenderer> = [];
  videos: Array<RemoteVideoStream> = [];

  //Video objects for local participant video in a call/local preview
  localView?: VideoStreamRendererView;
  localRender?: VideoStreamRenderer;
  localVideo?: LocalVideoStream;

  //Flags if notification is currently opened
  isNotificationOpened: boolean = false;

  //Stores the selected camera for the call
  selectedCam?: VideoDeviceInfo;
  isFriendCall: boolean;

  constructor(
    private acsCredential: AcsCredentialService,
    private notification: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private squabbleAccountService: SquabbleAccountService,
  ) {
    this.setUp();
  }

  // Opens a new notification sncakbar
  private openNotification(message: string, type: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: [type]
      });
  }

  //Set up the service
  setUp() {
    this.getUserData();
  }

  private getUserData() {
    this.squabbleAccountService.accountData.subscribe(async (account) => {
      if (Object.keys(account).length !== 0 && !this.userData) {
        this.userData = account;
        this.getCallClient();
        await this.setupNotificationEvents();
      }
    });
  }

  //Sets up the call service properties
  private getCallClient() {
    this.acsCredential.azureCommunicationTokenCredential.subscribe(
      async (tokenCredential: CommunicationTokenCredential) => {
        this.callClient = new CallClient(tokenCredential);

        try {
          this.callAgent = await this.callClient.createCallAgent(
            tokenCredential,
            {
              displayName:
                this.userData.firstName + ' ' + this.userData.surname,
            }
          );
        } catch (error) {
          console.log(error);
          window.location.reload();
        }

        await this.setDeviceManager();
        await this.setDeviceLists();
        //await this.setCallEvents();

        this.isLoaded = true;
      }
    );
  }

  //Set up the device lists
  private async setDeviceLists() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Can't enumerate devices on Safari.
    // https://docs.microsoft.com/en-us/azure/communication-services/concepts/known-issues#enumerating-devices-isnt-possible-in-safari-when-the-application-runs-on-ios-or-ipados
    if (!isSafari) {
      try {
        //Get lists of local mic, cameras, and speakers
        this.mics = await this.deviceManager.getMicrophones();
        this.cameras = await this.deviceManager.getCameras();
        this.speakers = await this.deviceManager.getSpeakers();
      } catch (error) {
        console.log(error);
      }
    }
  }

  //Sets the device manager
  private async setDeviceManager() {
    this.deviceManager = await this.callClient.getDeviceManager();
  }

  //Returns true if call agent has loaded
  async isCallAgentLoaded(): Promise<boolean> {
    while (this.callAgent === undefined) {
      await this.delay(100);
    }

    return true;
  }

  //Delays execution for a set amount of time
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //Notifies user of events and allows them to act upon them
  private async setupNotificationEvents() {
    //Setup call agent events if call agent has loaded
    await this.isCallAgentLoaded().then(() => {
      //Accept or reject a call
      this.callAgent!.on(
        'incomingCall',
        async (incomingCallEvent) => {
          this.incomingCall = await incomingCallEvent.incomingCall;

          //Reject the call if I am already in one
          if (this.call !== null && this.call !== undefined) {

            if (this.call?.state !== "Disconnected") {
              incomingCallEvent.incomingCall.reject();
              this.openNotification("Missed call from " + this.incomingCall.callerInfo.displayName, "error-notification");
            }
            else if (this.callHandled == true) {
              try {
                incomingCallEvent.incomingCall?.reject();
                this.openNotification("Missed call from " + this.incomingCall?.callerInfo.displayName, "error-notification");
              }
              catch (e) {
                console.log(e);
              }

            }
          }
          //Configure call end event and load the call notification if not in a call
          else {
            this.incomingCall.on("callEnded", () => {
              this.notification.dismiss();
              this.dialog.closeAll();
              this.isNotificationOpened = false;
              this.openNotification("The call timed out...", "error-notification");
              this.callHandled = false;
              this.router.navigate(['dashboard']);
            });
          }
          if (this.call === undefined || this.call === null || this.call.state === "Disconnected") {
            this.isNotificationOpened = false;
            //Render the incoming call notifier
            await this.fetchedIncomingCall();
          }
        }
      );
    });
  }

  //Display incoming call notification
  private async fetchedIncomingCall() {
    if (this.isNotificationOpened == false) {
      this.dialog.open(AcceptCallDialogComponent, {
        data: {
          callerName: this.incomingCall?.callerInfo.displayName,
        },
        panelClass: 'custom-dialog-container',
      });
    }
  }
}
