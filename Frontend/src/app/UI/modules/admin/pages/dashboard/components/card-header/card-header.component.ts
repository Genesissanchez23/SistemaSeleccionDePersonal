import { Component } from '@angular/core';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [],
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.css'
})
export class CardHeaderComponent {

  public list: card[] = [
    { label: 'Plazas Laborales', value: 124077 },
    { label: 'Empleados', value: 523220 },
    { label: 'Aspirantes', value: 723240 },
  ]

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

}

export interface card {
  label: string
  value: number
}