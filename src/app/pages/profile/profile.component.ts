import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AzureStorageService } from '../../services/azure-storage.service';
import { SquabbleAccountService } from '../../services/squabble-account.service';
import { passwordMatchValidator } from '../../shared/form-validation/password-match.directive';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  changePassword: boolean = false;
  editProfile: boolean = false;
  username: string = '';
  firstName: string = '';
  surname: string = '';
  email: string = '';
  isSso: boolean = false;
  picturesList: string[] = [];
  picturesDownloaded: string[] = []
  file!: File;
  avatarUrl: string = '/assets/images/default-avatar.jpeg';

  changePasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordMatchValidator });

  updateProfileForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required)
  });

  get password() { return this.changePasswordForm.get('password') as FormControl; }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword') as FormControl; }

  constructor(
    private blobService: AzureStorageService,
    private notification: MatSnackBar,
    private squabbleAccountService: SquabbleAccountService
  ) {
    this.subscribeToAccountData();
  }

  ngOnInit(): void {
    this.squabbleAccountService.refreshAccountData();
  }

  subscribeToAccountData() {
    this.squabbleAccountService.accountData.subscribe((data) => {
      this.username = data.userName;
      this.firstName = data.firstName;
      this.surname = data.surname;
      this.email = data.email;
      this.isSso = data.isSso;

      if (data.avatar) {
        this.avatarUrl = data.avatar;
        this.reloadImages();
      }

      this.updateProfileForm.controls['username'].setValue(data.userName);
      this.updateProfileForm.controls['email'].setValue(data.email);
      this.updateProfileForm.controls['firstName'].setValue(data.firstName);
      this.updateProfileForm.controls['surname'].setValue(data.surname);
    })
  }

  async updateProfile() {
    this.squabbleAccountService.updateAccountData({
      username: this.updateProfileForm.controls['username'].value,
      firstName: this.updateProfileForm.controls['firstName'].value,
      surname: this.updateProfileForm.controls['surname'].value,
    }).subscribe(
      () => {
        this.squabbleAccountService.refreshAccountData();

        this.notification.open('Profile updated successfully!', '',
          {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['confirm-notification']
          });

        this.editProfile = false;
      },
      (error) => {
        this.notification.open('Something went wrong!', '',
          {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['error-notification']
          });
      }
    )
  }

  async updatePassword() {
    this.squabbleAccountService.updateAccountData({
      username: this.updateProfileForm.controls['username'].value,
      password: this.changePasswordForm.controls['password'].value,
      confirmPassword: this.changePasswordForm.controls['confirmPassword'].value
    }).subscribe(
      () => {
        this.squabbleAccountService.refreshAccountData();

        this.notification.open('Password updated successfully!', '',
          {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['confirm-notification']
          });

        this.changePassword = false;
      },
      (error) => {
        this.notification.open('Something went wrong!', '',
          {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['error-notification']
          });
      }
    )
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  public imageSelected() {
    this.blobService.uploadFile(this.file, this.file.name, () => {}).then(res => {
      this.avatarUrl = res;

      this.squabbleAccountService.updateAccountData({
        username: this.updateProfileForm.controls['username'].value,
        avatarString: this.avatarUrl
      }).subscribe(
        () => {
          this.squabbleAccountService.refreshAccountData();
          this.editProfile = false;
        },
        (error) => {
          console.log(error);
        }
      )
    })
  }

  private reloadImages() {
    this.blobService.listFiles().then(list => {
      this.picturesList = list
      const array: string[] = []
      this.picturesDownloaded = array

      for (let name of this.picturesList) {
        this.blobService.downloadFile(name, blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            array.push(reader.result as string)
          }
        })
      }
    })
  }
}
