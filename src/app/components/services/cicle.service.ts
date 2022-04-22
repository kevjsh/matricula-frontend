import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Interfaces
import { Cicle } from '../interfaces/cicle.interface';

@Injectable({
    providedIn: 'root',
})
export class CicleService implements OnInit {
    
    private server: string = environment.baseUrl;

    constructor(private http: HttpClient) {}

    ngOnInit() {}

    saveCicle(cicle: Cicle){
        this.http.post<any>(`${this.server}/cicles`, cicle).subscribe();
    }

    deleteCicle(cicleId: number){
        this.http.delete<any>(`${this.server}/cicles/${cicleId}`).subscribe();
    }
}