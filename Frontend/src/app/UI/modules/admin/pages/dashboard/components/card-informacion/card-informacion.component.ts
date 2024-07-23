import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { DataItems } from '@domain/models/dashboard/dashboard.model';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { DashboardTresUsecase } from '@domain/usecases/dashboard/dashboard-card-tres.usecase';

@Component({
  selector: 'app-card-informacion',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-informacion.component.html',
  styleUrl: './card-informacion.component.css'
})
export class CardInformacionComponent implements OnInit, OnDestroy  {

  public list: DataItems[] = []
  private destroy$ = new Subject<void>()
  private response$!: Observable<DataItems[]>

  ngOnInit(): void {
    this.loadInfo()
  }

  constructor(private _dashboard: DashboardTresUsecase) {
    Object.assign(this, { single: this.list });
  }

  private loadInfo() {
    this.response$ = this._dashboard.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DataItems[]) => this.list = data
    })
  }

  view: [number, number] = [0, 0];
  
  colorScheme: Color = {
    domain: ['#D95747', '#5B9761', '#4377E7', '#333333'],    
    name: '',
    selectable: false,
    group: ScaleType.Time
    };
  cardColor: string = '#7CAC81';

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
  }  
  
  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
