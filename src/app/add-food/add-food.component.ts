import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { FoodService } from '../food.service';
import { Router } from '@angular/router';
import { RouteService } from '../routes.service';

@Component({
  selector: 'app-add-food',
  standalone: true,
  imports: [FormsModule, ButtonModule, ImageModule],
  templateUrl: './add-food.component.html',
  styleUrl: './add-food.component.css',
})
export class AddFoodComponent {
  @Output() close = new EventEmitter();
  @ViewChild('fileInput') fileInput!: ElementRef;

  enteredName = '';
  enteredAddress = '';
  enteredPrice = 0;
  enteredImage = '';

  imagePath: string = '';
  selectedFile: File | null = null;

  private foodService = inject(FoodService);
  private router = inject(Router);
  private routeService = inject(RouteService);

  onCancel() {
    const previousUrl = this.routeService.getPreviousUrl();
    if (previousUrl) {
      this.router.navigate([previousUrl]); // Navigate back to the previous route
    } else {
      this.router.navigate(['/']); // Default to home if no previous route
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
        this.enteredImage = this.selectedFile!.name;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSave() {
    if (
      this.enteredName &&
      this.enteredAddress &&
      this.enteredPrice &&
      this.enteredImage
    ) {
      this.foodService.addFood({
        name: this.enteredName,
        address: this.enteredAddress,
        price: this.enteredPrice,
        image: this.enteredImage,
      });
      this.router.navigate(['/']);
    } else {
      window.alert('Please fill in all fields');
    }
  }
}
