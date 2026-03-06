import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  teste = "home";
  show = false;
  list = [1, 2, 3, 4, 5];
  
  @Input() infoOut: string = "Valor padrão";

  submit(value: boolean) {
    this.show = value;
    console.log("submit", value);
  }
}
