import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { empleado } from '../../empleado.routes';
import { TokenService } from '@infrastructure/common/token.service';
import { UserModel } from '@domain/models/user/user.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '@UI/shared/services/toast.service';

@Component({
  selector: 'app-empleado-home', 
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatTooltipModule,
  ],
  templateUrl: './empleado-home.component.html',
  styleUrl: './empleado-home.component.css'
})
export default class EmpleadoHomeComponent implements OnInit {

  public user!: UserModel

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
  ) { }

  ngOnInit(): void {
    this.user = this._token.decryptAndSetUserData()
  }

  public routes = empleado
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route && !route.path?.includes(':'))


    onCerrarSesion(){
      this._token.clearToken()
      this._toast.success('Hasta pronto')
      this._router.navigate(['/login'])
    }

}
