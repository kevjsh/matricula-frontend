import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Interfaces
import { Group } from '../interfaces/group.interface';

@Injectable({
    providedIn: 'root',
})
export class GroupService implements OnInit {
    
    private server: string = environment.baseUrl;

    constructor(private http: HttpClient) {}

    ngOnInit() {}

    saveGroup(group: Group){
        this.http.post<any>(`${this.server}/groups`, group).subscribe();
    }

    deleteGroup(groupId: number){
        this.http.delete<any>(`${this.server}/groups/${groupId}`).subscribe();
    }
}