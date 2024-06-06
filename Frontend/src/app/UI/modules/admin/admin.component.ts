import { UserModel } from './../../../domain/models/user/user.model';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { administrador } from './admin.routes';
import { MatTooltipModule } from '@angular/material/tooltip';
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

  ngOnInit(): void {
    this.user = this.token.decryptAndSetUserData()
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public routes = administrador
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route && !route.path?.includes(':')
    )


  ngOnDestroy(): void {
    this.token.clearToken()
  }

}
