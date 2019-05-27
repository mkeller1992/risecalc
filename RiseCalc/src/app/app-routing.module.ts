import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculationsComponent } from './calculations/calculations.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
	{  
		path: 'calculations',
		component: CalculationsComponent
	},
	{  
		path: 'charts',
		component: ChartsComponent
	},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
