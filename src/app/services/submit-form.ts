import { Injectable } from '@angular/core';
import { Home } from '../components/home/home';

@Injectable({
  providedIn: 'root',
})
export class SubmitForm {
  constructor() {}

   submit(event: boolean) {
    console.log(event);
    Home.arguments.show = event;
  }
}
