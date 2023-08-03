import { Injectable } from '@angular/core';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { GetAccountDataService } from '../get-account-data.service';
import { AcsTokenService } from '../acs-token.service';
import { BehaviorSubject } from 'rxjs';
import {SquabbleAccountService} from "../squabble-account.service";

//Singleton service for the ACS credential initialisation and dispense
@Injectable({
  providedIn: 'root',
})
export class AcsCredentialService {

  private _azureCommunicationTokenCredential = new BehaviorSubject(
    {} as AzureCommunicationTokenCredential
  );
  private accountLoaded = false;
  azureCommunicationTokenCredential = this._azureCommunicationTokenCredential.asObservable();

  constructor(
    private getAccountDataService: GetAccountDataService,
    private squabbleAccountService: SquabbleAccountService,
    private tokenService: AcsTokenService
  ) {
    this.setUp();
  }

  //Configure the ACS credential
  private setUp() {
    this.squabbleAccountService.accountData.subscribe((account) => {
      if (Object.keys(account).length !== 0 && !this.accountLoaded) {
        this.accountLoaded = true;

        try {
          this._azureCommunicationTokenCredential.next(
            new AzureCommunicationTokenCredential({
              tokenRefresher: (): Promise<string> => {
                return this.tokenService.explicitRefreshTokenAsync(
                  account.communicationUserId
                );
              },
              refreshProactively: true,
              token: account.communicationToken,
            })
          );
        } catch (e) {
          console.log(e);
          //Reload the window if the ACS credential fails to get instantiated
          window.location.reload();
        }
      }
    });
  }
}
