import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Food, newFoodData } from './food/food.model';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private foods = [
    {
      id: 1,
      name: 'Phở',
      address: '123 Main St',
      price: 10.99,
      image: 'food_1.jpg',
    },
    {
      id: 2,
      name: 'Bún riêu',
      address: '456 Elm St',
      price: 8.99,
      image: 'food_2.jpg',
    },
    {
      id: 3,
      name: 'Bún bò Huế',
      address: '789 Oak St',
      price: 15.99,
      image: 'food_3.jpg',
    },
    {
      id: 4,
      name: 'Cơm rang dưa bò',
      address: '321 Maple St',
      price: 12.99,
      image: 'food_4.jpg',
    },
    {
      id: 5,
      name: 'Bún chả',
      address: '654 Pine St',
      price: 7.99,
      image: 'food_5.jpg',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Ensure the code only runs in the browser
    if (isPlatformBrowser(this.platformId)) {
      const foods = localStorage.getItem('foods');
      if (foods) {
        this.foods = JSON.parse(foods);
      }
    }
  }

  getFoodsList(): Food[] {
    return this.foods;
  }

  getFoodById(foodId: number): Food | undefined {
    return this.foods.find((food) => food.id === foodId);
  }

  removeFood(id: number) {
    this.foods = this.foods.filter((food) => food.id !== id);
    this.saveFoods();
  }

  addFood(foodData: newFoodData) {
    this.foods.push({
      id: this.foods.length + 1,
      name: foodData.name,
      price: foodData.price,
      address: foodData.address,
      image: foodData.image,
    });
    this.saveFoods();
  }

  updateFood(updatedFood: Food): Observable<Food> {
    const index = this.foods.findIndex((food) => food.id === updatedFood.id);
    if (index !== -1) {
      this.foods[index] = updatedFood;
      this.saveFoods();
      return of(updatedFood);
    }
    return of(updatedFood); // Return the original food if not found
  }

  private saveFoods() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('foods', JSON.stringify(this.foods));
    }    // return this.foods;
  }
}
