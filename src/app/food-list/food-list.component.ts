import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FoodComponent } from '../food/food.component';
import { CommonModule, NgFor } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Food } from '../food/food.model';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [FoodComponent, NgFor, CommonModule, DataViewModule, ScrollPanelModule, AnimateOnScrollModule, ToastModule, ButtonModule],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.css',
  providers: [MessageService],
})
export class FoodListComponent {
  @Input() foods: Food[] = [];
  @Output() foodSelected = new EventEmitter<number>();
  @Output() foodDeleted = new EventEmitter<number>();

private router = inject(Router);

  onFoodSelected(foodId: number) {
    this.foodSelected.emit(foodId);
  }

  onFoodDeleted(foodId: number) {
    this.foodDeleted.emit(foodId);
    this.router.navigate(['/']);

  }
}