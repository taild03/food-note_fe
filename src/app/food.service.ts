// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { Food, newFoodData } from './food/food.model';
// import { Observable, of } from 'rxjs';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({ providedIn: 'root' })
// export class FoodService {
//   private foods = [
//     {
//       id: 1,
//       name: 'Phở',
//       address: '123 Main St',
//       price: 10.99,
//       image: 'food_1.jpg',
//     },
//     {
//       id: 2,
//       name: 'Bún riêu',
//       address: '456 Elm St',
//       price: 8.99,
//       image: 'food_2.jpg',
//     },
//     {
//       id: 3,
//       name: 'Bún bò Huế',
//       address: '789 Oak St',
//       price: 15.99,
//       image: 'food_3.jpg',
//     },
//     {
//       id: 4,
//       name: 'Cơm rang dưa bò',
//       address: '321 Maple St',
//       price: 12.99,
//       image: 'food_4.jpg',
//     },
//     {
//       id: 5,
//       name: 'Bún chả',
//       address: '654 Pine St',
//       price: 7.99,
//       image: 'food_5.jpg',
//     },
//   ];

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     // Ensure the code only runs in the browser
//     if (isPlatformBrowser(this.platformId)) {
//       const foods = localStorage.getItem('foods');
//       if (foods) {
//         this.foods = JSON.parse(foods);
//       }
//     }
//   }

//   getFoodsList(): Food[] {
//     return this.foods;
//   }

//   getFoodById(foodId: number): Food | undefined {
//     return this.foods.find((food) => food.id === foodId);
//   }

//   removeFood(id: number) {
//     this.foods = this.foods.filter((food) => food.id !== id);
//     this.saveFoods();
//   }

//   addFood(foodData: newFoodData) {
//     this.foods.push({
//       id: this.foods.length + 1,
//       name: foodData.name,
//       price: foodData.price,
//       address: foodData.address,
//       image: foodData.image,
//     });
//     this.saveFoods();
//   }

//   updateFood(updatedFood: Food): Observable<Food> {
//     const index = this.foods.findIndex((food) => food.id === updatedFood.id);
//     if (index !== -1) {
//       this.foods[index] = updatedFood;
//       this.saveFoods();
//       return of(updatedFood);
//     }
//     return of(updatedFood); // Return the original food if not found
//   }

//   private saveFoods() {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.setItem('foods', JSON.stringify(this.foods));
//     }    // return this.foods;
//   }
// }

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Food, newFoodData } from './food/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private GET_ALL_FOODS = gql`
    query GetAllFoods($userId: Float!) {
      getAllFoods(userId: $userId) {
        id
        name
        price
        address
        image
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getFoodsList(userId: number): Observable<Food[]> {
    return this.apollo
      .watchQuery<{ getAllFoods: Food[] }>({  // Changed from query to watchQuery
        query: this.GET_ALL_FOODS,
        variables: {
          userId: userId
        }
      })
      .valueChanges
      .pipe(
        map((result) => result.data.getAllFoods),
        catchError((error) => {
          console.error('Error fetching foods:', error);
          return throwError(() => new Error('Error fetching foods'));
        })
      );
  }

  getFoodById(foodId: number, userId: number): Observable<Food> {
    return this.apollo
      .query<{ getFoodById: Food }>({
        query: gql`
          query GetFoodById($id: Int!, $userId: Int!) {
            getFoodById(id: $id, userId: $userId) {
              id
              name
              price
              address
              image
            }
          }
        `,
        variables: {
          id: foodId,
          userId: userId
        },
      })
      .pipe(
        map((result) => result.data.getFoodById),
        catchError((error) => {
          console.error('Error fetching food by ID:', error);
          return throwError(() => new Error('Error fetching food by ID'));
        })
      );
  }

  addFood(foodData: { name: string; address: string; price: number; image: string }, userId: number): Observable<Food> {
    return this.apollo
      .mutate<{ createFood: Food }>({
        mutation: gql`
          mutation CreateFood($name: String!, $address: String!, $price: Float!, $image: String!, $userId: Float!) {
            createFood(name: $name, address: $address, price: $price, image: $image, userId: $userId) {
              id
              name
              price
              address
              image
            }
          }
        `,
        variables: {
          name: foodData.name,
          address: foodData.address,
          price: foodData.price,
          image: foodData.image,
          userId: userId
        },
        update: (cache, { data }) => {
          if (!data) return;

          const existingFoods = cache.readQuery<{ getAllFoods: Food[] }>({
            query: this.GET_ALL_FOODS,
            variables: { userId }
          });

          if (existingFoods) {
            cache.writeQuery({
              query: this.GET_ALL_FOODS,
              variables: { userId },
              data: {
                getAllFoods: [...existingFoods.getAllFoods, data.createFood]
              }
            });
          }
        }
      })
      .pipe(
        map((result) => result.data!.createFood),
        catchError((error) => {
          console.error('Error adding food:', error);
          return throwError(() => new Error('Error adding food'));
        })
      );
  }

  // food.service.ts
updateFood(updatedFood: Food, userId: number): Observable<Food> {
  return this.apollo
    .mutate<{ updateFood: Food }>({
      mutation: gql`
        mutation UpdateFood(
          $id: Int!,
          $userId: Int!,
          $name: String,
          $price: Float,
          $address: String,
          $image: String
        ) {
          updateFood(
            id: $id,
            userId: $userId,
            name: $name,
            price: $price,
            address: $address,
            image: $image
          ) {
            id
            name
            price
            address
            image
          }
        }
      `,
      variables: {
        id: updatedFood.id,
        userId: userId,
        name: updatedFood.name,
        price: updatedFood.price,
        address: updatedFood.address,
        image: updatedFood.image
      },
      update: (cache, { data }) => {
        if (!data) return;

        const existingFoods = cache.readQuery<{ getAllFoods: Food[] }>({
          query: this.GET_ALL_FOODS,
          variables: { userId }
        });

        if (existingFoods) {
          const updatedFoods = existingFoods.getAllFoods.map(food => 
            food.id === updatedFood.id ? data.updateFood : food
          );
          
          cache.writeQuery({
            query: this.GET_ALL_FOODS,
            variables: { userId },
            data: {
              getAllFoods: updatedFoods
            }
          });
        }
      }
    })
    .pipe(
      map((result) => {
        if (!result.data) {
          throw new Error('No data returned from update mutation');
        }
        return result.data.updateFood;
      }),
      catchError((error) => {
        console.error('Error updating food:', error);
        return throwError(() => new Error('Error updating food'));
      })
    );
}

  deleteFood(id: number, userId: number): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteFood: boolean }>({
        mutation: gql`
          mutation DeleteFood($id: Int!, $userId: Int!) {
            deleteFood(id: $id, userId: $userId)
          }
        `,
        variables: {
          id: id,
          userId: userId
        },
        update: (cache) => {
          const existingFoods = cache.readQuery<{ getAllFoods: Food[] }>({
            query: this.GET_ALL_FOODS,
            variables: { userId }
          });

          if (existingFoods) {
            cache.writeQuery({
              query: this.GET_ALL_FOODS,
              variables: { userId },
              data: {
                getAllFoods: existingFoods.getAllFoods.filter(food => food.id !== id)
              }
            });
          }
        }
      })
      .pipe(
        map((result) => result.data!.deleteFood),
        catchError((error) => {
          console.error('Error deleting food:', error);
          return throwError(() => new Error('Error deleting food'));
        })
      );
  }
}