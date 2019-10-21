import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AvailabilityService } from './services/availability.service';
import { AppointmentService } from './services/appointment.service';

import { Talent } from './models/Talent';
import { Appointment } from './models/Appointment';
import { Availability } from './models/Availability';


enum mode {
  NotSet = 1,
  Talent = 2,
  Restaurant = 3
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Poolside Interview Scheduler';
  currentMode: number;
  currentTalent: Talent = new Talent();
  rescheduling: boolean = false;
  talentInterview: Appointment = null;
  schedule: Availability[] = [];
  @ViewChild('roleModal') roleModal: ModalDirective;
  @ViewChild('newAvailability') newAvailability: ModalDirective;

  constructor(
    private availabilityService: AvailabilityService,
    private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.currentMode = mode.NotSet;
    this.refreshAvailability();
  }

  isModalShown(): boolean {
    return this.currentMode === mode.NotSet;
  }

  isModeSet(): boolean {
    return this.currentMode !== mode.NotSet;
  }

  isRestaurant(): boolean {
    return this.currentMode === mode.Restaurant;
  }

  isTalent(): boolean {
    return this.currentMode === mode.Talent;
  }

  isInterviewConfirmed(): boolean {
    return this.talentInterview !== null;
  }

  isRescheduling(): boolean {
    return (this.isTalent && this.rescheduling);
  }

  showTalentInterviewTime(): boolean {
    return this.isTalent()
      && this.isInterviewConfirmed();
  }

  showSchedule(): boolean {
    return (this.isRestaurant()
      || (this.isTalent() &&
        (!this.isInterviewConfirmed() || this.isRescheduling())));
  }

  startTalent($event: Talent): void {
    if (this.isModalShown) {
      console.log('talent start: ', $event);
      this.currentMode = mode.Talent;
      this.currentTalent = $event;
      this.refreshAppointment();
    }
  }

  availabilityCreated($event): void {
    this.refreshAvailability();
    this.newAvailability.hide();
  }

  startRestaurantSubmit(): void {
    console.log('restaurant start');
    this.currentMode = mode.Restaurant;
  }

  changeRole(): void {
    this.currentMode = mode.NotSet;
    this.refreshAvailability();
    this.talentInterview = null;
  }

  refreshAvailability(): void {
    this.availabilityService.getAvailabilityByRange(
      new Date("2018-12-31"),
      new Date("2021-01-01")
    ).subscribe((availability) => {
      console.log('Availability: ', availability);
      this.schedule = availability;
    });
  }

  refreshAppointment(): void {
    if (this.currentTalent && this.currentTalent.email) {
      this.appointmentService.getAppointmentByEmail(this.currentTalent.email)
        .subscribe((appointments) => {
          console.log(appointments);
          if (appointments && appointments.length > 0) {
            appointments.forEach((appointment, index) => {
              if (appointment.availability) {
                this.talentInterview = appointment;
              }
            });
          }
        });
    }
  }

  showNewAvailability(): void {
    this.newAvailability.show();
  }

  canShow(availability: Availability): boolean {
    return ((availability.appointment === null &&
      this.isTalent()) || this.isRestaurant());
  }

  canBook(availability: Availability): boolean {
    return this.isTalent()
      && availability.appointment === null
      && !this.isRescheduling();
  }

  canReschedule(availability: Availability): boolean {
    return this.isTalent()
      && availability.appointment === null
      && this.isRescheduling();
  }

  reserveSlot(availability: Availability): void {
    let availabilityCopy = { ...availability };
    availabilityCopy.appointment = new Appointment();
    availabilityCopy.appointment.email = this.currentTalent.email;
    availabilityCopy.appointment.phone = this.currentTalent.phone;


    this.availabilityService.updateAvailability(availabilityCopy)
      .subscribe((updatedAvailability) => {
        this.refreshAvailability();
        this.refreshAppointment();
      });
  }

  cancelInterview(appointment: Appointment): void {
    let availability = new Availability();
    availability.availabilityDate = appointment.availability.availabilityDate;
    availability.availabilityId = appointment.availability.availabilityId;
    availability.duration = appointment.availability.duration;
    availability.appointment = null;

    this.availabilityService.updateAvailability(availability)
      .subscribe((updatedAvailability) => {
        this.talentInterview = null;
        this.refreshAvailability();
        this.refreshAppointment();
      });
  }

  rescheduleInterview(newAvailability: Availability): void {
    let appointmentCopy = { ...this.talentInterview };
    appointmentCopy.availability = new Availability();
    appointmentCopy.availability.availabilityDate = newAvailability.availabilityDate;
    appointmentCopy.availability.availabilityId = newAvailability.availabilityId;
    appointmentCopy.availability.duration = newAvailability.duration;

    this.appointmentService.updateAppointment(appointmentCopy)
      .subscribe((updatedAppointment) => {
        this.talentInterview = null;
        this.refreshAvailability();
        this.refreshAppointment();
        this.rescheduling = false;
      });
  }

  startReschedule(): void {
    this.rescheduling = true;
  }

  cancelRescheduling(): void {
    this.rescheduling = false;
  }
}
