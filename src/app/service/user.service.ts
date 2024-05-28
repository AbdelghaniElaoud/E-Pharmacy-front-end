import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    }
    return null;
  }
}
