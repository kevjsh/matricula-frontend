import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Interfaces
import { Career } from '../interfaces/careers.interface';

@Injectable({
    providedIn: 'root',
})
export class CareerService implements OnInit {

    private server: string = environment.baseUrl;

    constructor(private http: HttpClient) {}

    ngOnInit() {}

    saveCareer(career: Career){
        this.http.post<any>(`${this.server}/careers`, career).subscribe();
    }

    deleteCareer(careerId: number){
        this.http.delete<any>(`${this.server}/careers/${careerId}`).subscribe();
    }
}