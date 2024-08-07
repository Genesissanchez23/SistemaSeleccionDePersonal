// Importaciones de RxJS y Angular
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Importaciones del enrutador
import { administrador } from './admin.routes';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

// Importaciones de Material Design
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

//Domain
import { UserModel } from '@domain/models/user/user.model';

//Service
import { TokenService } from '@infrastructure/common/token.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    AsyncPipe,
  ]
})
export default class AdminComponent implements OnInit, OnDestroy {

  private token = inject(TokenService)
  private breakpointObserver = inject(BreakpointObserver)
  public user!: UserModel

  constructor(
    private _router: Router,
    private _tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.user = this.token.decryptAndSetUserData()
  }

  // Observable para verificar si el dispositivo es un dispositivo móvil
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Método para cerrar sesión
  cerrarSesion() {
    this._tokenService.clearToken()
    this._router.navigate(['/login'])
  }

  // Obtener las rutas administrativas
  public routes = administrador
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route && !route.path?.includes(':'))


  ngOnDestroy(): void {
    this.token.clearToken() // Limpiar token al destruir el componente
  }

}
