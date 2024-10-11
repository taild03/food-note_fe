import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { FoodListComponent } from "../food-list/food-list.component";
import { SplitterModule } from "primeng/splitter";
import { FoodDetailsComponent } from "../food-details/food-details.component";
import { SpeedDialModule } from "primeng/speeddial";
import { MessagesModule } from "primeng/messages";
import { ButtonModule } from "primeng/button";
import { AddFoodComponent } from "../add-food/add-food.component";
import { FormsModule } from "@angular/forms";
import { NoFoodComponent } from "../no-food/no-food.component";
import { LoginComponent } from "../auth/login/login.component";
import { SignupComponent } from "../auth/signup/signup.component";
import { FoodService } from "../food.service";
import { RouteService } from "../routes.service";
import { Food } from "../food/food.model";
import { Message } from "primeng/api";


@Component({
  selector: 'app-mainscreen',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FoodListComponent,
    SplitterModule,
    FoodDetailsComponent,
    MessagesModule,
    SpeedDialModule,
    ButtonModule,
    AddFoodComponent,
    FormsModule,
    NoFoodComponent,
    LoginComponent,
    SignupComponent,
  ],
  templateUrl: './mainscreen.component.html',
  styleUrl: './mainscreen.component.css',
})
export class MainscreenComponent implements OnInit {
  constructor(
    private foodService: FoodService,
    private router: Router,
    private route: ActivatedRoute,
    private routeService: RouteService
  ) {}

  foods: Food[] = [];
  selectedFoodId?: number;
  messages!: Message[];

  ngOnInit() {
    this.refreshFoodList();
    this.messages = [
      { severity: 'info', detail: 'Please select a food to see its details' },
    ];
  }

  get selectedFood() {
    return this.foods.find((food) => food.id === this.selectedFoodId);
  }

  refreshFoodList() {
    this.foods = this.foodService.getFoodsList();
  }

  onFoodSelected(foodId: number) {
    this.selectedFoodId = foodId;
    this.router.navigate([foodId, 'details'], { relativeTo: this.route });
  }

  onFoodDeleted(foodId: number) {
    this.refreshFoodList();
    if (this.selectedFoodId === foodId) {
      this.selectedFoodId = undefined;
      this.router.navigate(['/home']);
    }
  }

  onFoodUpdated(updatedFood: Food) {
    this.refreshFoodList();
    this.selectedFoodId = updatedFood.id;
  }

  onFabClick() {
    this.routeService.setPreviousUrl(this.router.url);
    this.router.navigate(['add-food'], { relativeTo: this.route });
  }
}


