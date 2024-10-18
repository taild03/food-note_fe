import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { Food } from '../food/food.model';
import { FoodService } from '../food.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UpdateFoodComponent } from '../update-food/update-food.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [
    InputTextModule,
    InputNumberModule,
    ImageModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    UpdateFoodComponent,
    ToastModule
  ],
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.css',
})
// export class FoodDetailsComponent {
//   @Input() food!: Food;
//   @Output() foodDeleted = new EventEmitter<number>();
//   food2: Food | undefined;

//   private foodService = inject(FoodService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);

//   ngOnInit() {
//     this.route.params.subscribe(params => {
//       if (params['id']) {
//         const foodId = +params['id'];
//         this.food2 = this.foodService.getFoodById(foodId);
//       }
//     });
//   }

//   get imagePath() {
//     return 'assets/foods/' + this.food.image;
//   }

//   onDeleteFood() {
//     this.foodService.removeFood(this.food.id);
//     this.foodDeleted.emit(this.food.id);
//     this.router.navigate(['/']);
//   }

//   onUpdateFood() {
//     if (this.food) {
//       this.router.navigate(['/home', this.food.id, 'update']);
//     }
//   }
// }

export class FoodDetailsComponent implements OnInit {
  @Input() food!: Food;
  @Output() foodDeleted = new EventEmitter<number>();
  food2: Food | undefined;
  private userId: number | null;

  private foodService = inject(FoodService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private authService = inject(AuthService); // Add AuthService injection

  constructor() {
    this.userId = this.authService.getCurrentUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
  }
  ngOnInit() {
    if (!this.userId) return;

    this.route.params.subscribe((params) => {
      if (params['id']) {
        const foodId = +params['id'];
        // Fetch the food by ID using the GraphQL backend
        this.foodService.getFoodById(foodId, this.userId!).subscribe({
          next: (data) => {
            this.food2 = data;
          },
          error: (err) => {
            console.error('Error fetching food details', err);
          }
        });
      }
    });
  }

  get imagePath() {
    return 'assets/foods/' + this.food.image;
  }

  onDeleteFood() {
    // Call the GraphQL mutation to delete the food
    this.foodService.deleteFood(this.food.id, this.userId!).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error deleting food', err);
      }
    });
    // this.foodService.deleteFood(this.food.id, this.userId!);
  }

  onUpdateFood() {
    if (this.food) {
      this.router.navigate(['/home', this.food.id, 'update']);
    }
  }
}