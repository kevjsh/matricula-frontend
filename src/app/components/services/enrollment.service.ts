import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Interfaces
import { Enrollment } from '../interfaces/enrollment.interface';

@Injectable({
    providedIn: 'root',
})
export class EnrollmentService implements OnInit {
    
    private server: string = environment.baseUrl;

    constructor(private http: HttpClient) {}

    ngOnInit() {}

    saveEnrollment(enrollment: Enrollment){
        this.http.post<any>(`${this.server}/enrollments`, enrollment).subscribe();
    }

    deleteEnrollment(enrollmentId: number){
        this.http.delete<any>(`${this.server}/enrollments/${enrollmentId}`).subscribe();
    }
}