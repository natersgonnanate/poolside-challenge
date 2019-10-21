import { Appointment } from './Appointment';

export class Availability {
    availabilityId: number;
    availabilityDate: Date;
    duration: number;
    appointment: Appointment;
};