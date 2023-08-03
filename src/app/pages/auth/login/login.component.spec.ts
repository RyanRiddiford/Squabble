import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicrosoftLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { LoginComponent } from './login.component';
import { environment } from '../../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        SocialLoginModule
      ],
      providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: MicrosoftLoginProvider.PROVIDER_ID,
                provider: new MicrosoftLoginProvider(
                  '4f6382f2-1260-4d80-993c-1ed36d550ff0',
                  {
                    redirect_uri: `${environment.siteUrlBase}/sso`,
                    logout_redirect_uri: `${environment.siteUrlBase}/logout`,
                  }
                ),
              },
            ],
            onError: (err) => {
              console.error(err);
            },
          } as SocialAuthServiceConfig,
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login form is invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });
});
