import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}


  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}/get-profile`).pipe(
      map(response => response.content)
    );
  }
  updateProfile(userData: any): Observable<any> {
    const url = 'http://localhost:8080/api/users/update-profile';
    return this.http.post<any>(url, userData);
  }
}
