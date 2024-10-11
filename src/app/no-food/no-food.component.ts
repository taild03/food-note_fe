import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-no-food',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './no-food.component.html',
  styleUrl: './no-food.component.css'
})
export class NoFoodComponent {

}
