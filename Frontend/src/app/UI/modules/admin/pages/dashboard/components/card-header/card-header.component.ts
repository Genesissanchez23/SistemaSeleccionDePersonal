import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataItemsUno } from '@domain/models/dashboard/dashboard.model';
import { DashboardUnoUsecase } from '@domain/usecases/dashboard/dashboard-card-uno.usecase';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [],
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.css'
})
export class CardHeaderComponent implements OnInit, OnDestroy {
 
  public list: DataItemsUno[] = []
  private destroy$ = new Subject<void>()
  private response$!: Observable<DataItemsUno[]>

  constructor(private _dashboard: DashboardUnoUsecase) { }

  ngOnInit(): void {
    this.loadInfo()
  }

  private loadInfo() {
    this.response$ = this._dashboard.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DataItemsUno[]) => this.list = data
    })
  }

  public getClass(index: number): string {
    if (index === 1) {
      return 'col-12 d-none d-md-block col-md-6 col-lg-4 d-flex justify-content-center';
    } else if (index === 2) {
      return 'col-12 d-none d-lg-block col-md-6 col-lg-4 d-flex justify-content-center';
    }
    return 'col-12 col-md-6 col-lg-4 d-flex justify-content-center';
  }

  public getClassIcon(index: number): string {
    return (index === 0)
      ? 'pi pi-briefcase'
      : (index === 1)
        ? 'pi pi-user'
        : 'pi pi-users';
  }

  public getClassColor(index: number): string {
    return (index === 0)
      ? 'bg-orange-custom'
      : (index === 1)
        ? 'bg-green-custom'
        : 'bg-black-custom';
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}