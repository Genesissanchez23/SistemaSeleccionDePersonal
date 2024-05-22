import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class ToatService {

  notyf = new Notyf();

  private showToast(message: string, options: { icon: string, background: string }) {
    const config = {
      duration: 5000,
      dismissible: true,
      ...options,
    };

    this.notyf.open({
      message,
      ...config,
    });
  }

  error(mensaje: string) {
    const options = {
      icon: '<i class="bi bi-emoji-tear-fill"></i>',
      background: 'var(--orange-custom)',
    };
    this.showToast(mensaje, options);
  }


}
