import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { CareerComponent } from './career.component';

const routes: Routes = [
    {
        path: '',
        children:[
            {
                path: 'careers',
                component: CareerComponent
            },
            {
                path: "**",
                component: CareerComponent
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CareerRoutingModule { }