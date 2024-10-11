import { Component, EventEmitter, inject, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Food } from '../food/food.model';
import { FoodService } from '../food.service';
import { ImageModule } from 'primeng/image';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../routes.service';

@Component({
  selector: 'app-update-food',
  standalone: true,
  imports: [FormsModule, ButtonModule, ImageModule],
  templateUrl: './update-food.component.html',
  styleUrl: './update-food.component.css'
})
export class UpdateFoodComponent implements OnInit, OnDestroy {
  editedFood!: Food;
  imagePath!: string;
  selectedFile: File | null = null;
  tempObjectUrl: string | null = null;

  private foodService = inject(FoodService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeService = inject(RouteService);

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = +params['id'];
        const food = this.foodService.getFoodById(id);
        if (food) {
          this.editedFood = { ...food };
          this.updateImagePath();
        } else {
          console.error(`Food with id ${id} not found`);
          this.router.navigate(['/home']);
        }
      } else {
        console.error('No id provided in route');
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    if (this.tempObjectUrl) {
      URL.revokeObjectURL(this.tempObjectUrl);
    }
  }

  updateImagePath() {
    if (this.tempObjectUrl) {
      this.imagePath = this.tempObjectUrl;
    } else {
      this.imagePath = 'assets/foods/' + this.editedFood.image;
    }
  }

  onCancel() {
    this.router.navigate(['/home', this.editedFood.id, 'details']);
  }

  onSave() {
    if (this.selectedFile) {
      this.editedFood.image = this.selectedFile.name;
    }
    this.foodService.updateFood(this.editedFood).subscribe(
      (updatedFood) => {
        this.editedFood = updatedFood;
        this.updateImagePath();
        this.router.navigate(['/home', this.editedFood.id, 'details']);
      },
      (error) => {
        console.error('Error updating food:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if (this.tempObjectUrl) {
        URL.revokeObjectURL(this.tempObjectUrl);
      }
      this.tempObjectUrl = URL.createObjectURL(this.selectedFile);
      this.imagePath = this.tempObjectUrl;
    }
  }
}