import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Availability } from '../models/Availability';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(private http: HttpClient) { }

  getAvailabilityByRange(startDate: Date, endDate: Date): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${environment.poolside_challenge_api}/availability/byrange/?startdate=${startDate.toISOString()}&enddate=${endDate.toISOString()}`);
  }

  createAvailability(availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${environment.poolside_challenge_api}/availability`, availability);
  }

  updateAvailability(availability: Availability): Observable<Availability> {
    return this.http.put<Availability>(`${environment.poolside_challenge_api}/availability`, availability);
  }
}
