import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/Appointment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAppointmentByEmail(email: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.poolside_challenge_api}/appointment/byemail/${email}`);
  }

  updateAppointment(updatedAppointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${environment.poolside_challenge_api}/appointment/`, updatedAppointment);
  }
}
