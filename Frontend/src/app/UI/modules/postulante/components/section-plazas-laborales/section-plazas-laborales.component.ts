// Importaciones de RxJS y Angular
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { TextComponent } from '@UI/shared/atoms/text/text.component';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoListaUsecase } from '@domain/usecases/trabajo/trabajo-lista.usecase';
import { CardPlazasLaboralesComponent } from '../../layouts/card-plazas-laborales/card-plazas-laborales.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-plazas-laborales',
  standalone: true,
  imports: [TextComponent, CardPlazasLaboralesComponent, CommonModule],
  templateUrl: './section-plazas-laborales.component.html',
  styleUrl: './section-plazas-laborales.component.css'
})
export class SectionPlazasLaboralesComponent implements OnInit {

  public btnAll: boolean = true
  public btnFavorites: boolean = false
  public loading = signal<boolean>(false)
  public data!: TrabajoModel[]
  public filteredData!: TrabajoModel[];

  public selectedModalidad: string = 'Todos';
  public selectedContrato: string = 'Todos';
  public searchTerm: string = '';

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _listTrabajo: TrabajoListaUsecase
  ) { }

  public listModalidad = [
    { 'label': 'Presencial' },
    { 'label': 'Virtual' },
    { 'label': 'Hibrido' },
    { 'label': 'Todos' },
  ]

  public listContrato = [
    { 'label': 'Tiempo Completo' },
    { 'label': 'Medio Tiempo' },
    { 'label': 'Por Horas' },
    { 'label': 'Todos' },
  ]

  ngOnInit(): void {
    this.loadPlazasLaborales()
  }

  private loadPlazasLaborales() {
    this.loading.update(() => true)
    this.response$ = this._listTrabajo.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        this.data = data.body.reverse();
        this.filteredData = this.data;
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  public showAll(): void {
    this.btnAll = true;
    this.btnFavorites = false;
    this.filteredData = this.data;
  }

  public showFavorites(): void {
    this.btnAll = false;
    this.btnFavorites = true;
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteIds') || '[]');
    const favoriteData = this.data.filter(item => favoriteIds.includes(item.id));
    this.filteredData = this.applyFilters(favoriteData);
  }

  public filterByModalidad(modalidad: string): void {
    this.selectedModalidad = modalidad;
    this.filteredData = this.applyFilters(this.data);
  }

  public filterByContrato(contrato: string): void {
    this.selectedContrato = contrato;
    this.filteredData = this.applyFilters(this.data);
  }

  public onSearch(event: Event): void {
    this.searchTerm = this.normalizeText((<HTMLInputElement>event.target).value);
    this.filteredData = this.applyFilters(this.data);
  }

  private applyFilters(data: TrabajoModel[]): TrabajoModel[] {
    return data.filter(item =>
      (this.selectedModalidad === 'Todos' || item.modalidad === this.selectedModalidad) &&
      (this.selectedContrato === 'Todos' || item.contrato === this.selectedContrato) &&
      (this.searchTerm === '' || item.titulo!.toLowerCase().includes(this.searchTerm))
    );
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error al momento de listar los permisos:', err)
  }

  private normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

}
