import { Routes } from "@angular/router";
import { AddFoodComponent } from "../add-food/add-food.component";
import { FoodDetailsComponent } from "../food-details/food-details.component";
import { UpdateFoodComponent } from "../update-food/update-food.component";

export const foodRoutes: Routes = [
    { path: 'add-food', component: AddFoodComponent },
    { path: ':id/details', component: FoodDetailsComponent },
    { path: ':id/update', component: UpdateFoodComponent },
];