import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Availability } from "./availability";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    appointmentId: number;

    @Column()
    email: string;

    @Column()
    phone: string;

    @OneToOne(type => Availability)
    @JoinColumn()
    availability: Availability;
}