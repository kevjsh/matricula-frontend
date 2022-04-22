import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { CicleComponent } from './cicle.component';

const routes: Routes = [
    {
        path: '',
        children:[
            {
                path: 'cicles',
                component: CicleComponent
            },
            {
                path: "**",
                component: CicleComponent
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
export class CicleRoutingModule {}