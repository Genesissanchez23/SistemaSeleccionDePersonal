import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextComponent } from '../../shared/atoms/text/text.component';
import { TitleComponent } from '../../shared/atoms/title/title.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToatService } from '../../shared/services/toat.service';
import { Observable } from 'rxjs';
import { UserEntity } from '../../../infrastructure/repositories/user/entities/user.entity';
import { UserGateway } from '../../../domain/models/user/gateway/user.gateway';

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
export default class AuthenticationComponent {

  public form: FormGroup
  public loading = signal<boolean>(false)
  private response$!: Observable<UserEntity>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToatService,
    private _userLogin: UserGateway
  ) {
    this.form = this._fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const params = {
      username: this.username.value,
      password: this.password.value
    }

    this.loading.update(() => true)

    /*  this.response$ = this._userLogin.login(params)
     this.response$.subscribe({
       next: (data) => console.log(data),
       error: (err) => console.error(err),
       complete:() => this.loading.update(() => false)
     }) */
     
  }


  get username() { return this.form.get('username')! }
  get password() { return this.form.get('password')! }

}
