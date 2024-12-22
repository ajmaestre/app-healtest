import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-objetivs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './objetivs.component.html',
  styleUrl: './objetivs.component.css'
})
export class ObjetivsComponent {

  paragraps:string[] = [
    "Buscamos prevenir posibles problemas de salud mental en los niños a una edad temprana.",
    "Queremos proporcionar una plataforma interactiva que sea de interés para niños. ",
    "Un entorno para niños donde se les facilite el manejo y la navegación en la plataforma.",
    "Fomentamos el interés en niños para que sigan interactuando con la plataforma.",
  ];

  constructor(){}

}
