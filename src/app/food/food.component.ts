import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Food } from './food.model';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FoodService } from '../food.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    TagModule,
    CommonModule,
    ButtonGroupModule,
    
  ],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css',
})
export class FoodComponent {
  @Input({ required: true }) food!: Food;
  @Output() select = new EventEmitter<number>();
  @Output() foodDeleted = new EventEmitter<number>();
  private userId: number | null;

  private foodService = inject(FoodService);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.userId = this.authService.getCurrentUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
  }
  get imagePath() {
    return 'assets/foods/' + this.food.image;
  }

  onViewingFood() {
    this.select.emit(this.food.id);
    this.router.navigate(['/home', this.food.id, 'details']);
  }

  onDeleteFood() {
    this.foodService.deleteFood(this.food.id, this.userId!);
    this.foodDeleted.emit(this.food.id);
  }
}