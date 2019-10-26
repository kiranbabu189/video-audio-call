import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReceiverComponent } from "./receiver/receiver.component";
import { AppComponent } from "./app.component";
import { CallerComponent } from "./caller/caller.component";
const routes: Routes = [
  { path: "", redirectTo: "/caller", pathMatch: "full" },
  {
    path: "incoming-call/:code",
    component: ReceiverComponent,
    pathMatch: "full"
  },
  {
    path: "caller",
    component: CallerComponent,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
