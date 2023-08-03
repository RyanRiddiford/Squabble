import { Injectable } from '@angular/core';
import { ChatClient } from '@azure/communication-chat';
import { environment } from 'src/environments/environment';
import { AcsCredentialService } from './acs-cred.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatClientService {
  private tokenCredential: string;
  chatClient!: ChatClient;

  constructor(
    private acsCredential: AcsCredentialService,
    private httpClient: HttpClient
  ) {
    this.setUp();
  }

  private setUp() {
    this.getChatClient();
  }

  /** get a chat client */
  private getChatClient() {
    this.acsCredential.azureCommunicationTokenCredential.subscribe(
      async (tokenCredential) => {
        if (Object.keys(tokenCredential).length !== 0) {
          const accessToken = await tokenCredential.getToken();
          this.tokenCredential = accessToken.token;

          this.chatClient = new ChatClient(
            environment.acsTextChatEndpoint,
            tokenCredential
          );
        }
      }
    );
  }

  /**
   * This is a rather hacky what to determine if a user has access to an Azure thread. Azure has
   * no existing methods to determine this, specifically for a user who once had access to a thread
   * but has since been removed. In this case, Azure still returns the old Thread ID as if they
   * still had access.
   */
  async userHasAccessToThread(threadId: string): Promise<boolean> {
    if (!threadId) {
      return false;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.tokenCredential}`,
      }),
    };

    const url = `${environment.acsTextChatEndpoint
      }/chat/threads/${encodeURIComponent(
        threadId
      )}/participants?api-version=2021-09-07`;

    try {
      await this.httpClient.get(url, httpOptions).toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }
}
