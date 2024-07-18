// Importaciones de Angular
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

// Modelos de Dominio
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';

// Importaciones de Material Design
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '@domain/models/user/user.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Importaciones de infrastructura
import { TokenService } from '@infrastructure/common/token.service';

// Importaciones de UI
import { ToastService } from '@UI/shared/services/toast.service';
import { PostulacionFormComponent } from '@UI/modules/postulante/components/postulacion-form/postulacion-form.component';

@Component({
  selector: 'app-card-plazas-laborales',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, MatTooltipModule],
  templateUrl: './card-plazas-laborales.component.html',
  styleUrl: './card-plazas-laborales.component.css'
})
export class CardPlazasLaboralesComponent implements OnInit, OnChanges {

  @Input({ required: true }) data: TrabajoModel[] = []
  public list: TrabajoModel[] = []
  public favoriteIds: Set<number> = new Set<number>();
  private usuario!: UserModel

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _token: TokenService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes) {
      this.list = changes['data'].currentValue;
    }
  }

  ngOnInit(): void {
    this.list = this.data
    this.usuario = this._token.decryptAndSetUserData()
    this.loadFavorites()
  }

  // Abrir diálogo para postularse en la plaza laboral
  openAgregar(data: TrabajoModel) {
    this._dialog.open(PostulacionFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  toggleFavorite(itemId: number) {
    if (this.favoriteIds.has(itemId)) {
      this.favoriteIds.delete(itemId);
    } else {
      this.favoriteIds.add(itemId);
    }
    this.saveFavorites();
  }

  saveFavorites() {
    localStorage.setItem(`favoriteIds_${this.usuario.id}`, JSON.stringify(Array.from(this.favoriteIds)));
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem(`favoriteIds_${this.usuario.id}`);
    if (savedFavorites) {
      this.favoriteIds = new Set<number>(JSON.parse(savedFavorites));
    }
  }

  isFavorite(itemId: number): boolean {
    return this.favoriteIds.has(itemId);
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (respuesta.status) {
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
  }

}
