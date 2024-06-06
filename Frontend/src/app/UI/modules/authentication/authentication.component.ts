import { Observable, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


//Domain
import { UserLoginUsecase } from '@domain/usecases/user/user-login.usecase';
import { ResponseModel } from '@domain/common/response-model';

//Services
import { ToastService } from '@shared/services/toast.service';
import { TokenService } from '@infrastructure/common/token.service';

//Components
import { TextComponent } from '@shared/atoms/text/text.component';
import { TitleComponent } from '@shared/atoms/title/title.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TextComponent,
    TitleComponent
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export default class AuthenticationComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public loading = signal<boolean>(false);
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _userLogin: UserLoginUsecase
  ) {
    this.form = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._token.clearToken();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toast.error('Todos los campos son requeridos');
      return;
    }

    const params = {
      usuario: this.username.value,
      contrasena: this.password.value
    };

    this.loading.update(() => true); 

    this.response$ = this._userLogin.perform(params);
    this.subscription.add(
      this.response$.subscribe({
        next: (data: ResponseModel) => {
          if (data.status) {
            this._toast.success('Enhorabuena, Bienvenido!')
            this._router.navigate(['/administrador/'])                
          }
          else {
            this._toast.error('Credenciales incorrectas')
          };
        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.'),
        complete: () => this.loading.update(() => false)
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get username() { return this.form.get('username')! }
  get password() { return this.form.get('password')! }

}
