import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    CreateDateColumn
} from "typeorm";
import { Appointment } from "./appointment";

@Entity()
export class Availability {
    @PrimaryGeneratedColumn({
        type: "int"
    })
    availabilityId: number;

    @Column({
        nullable: false,
        unique: false,
        type: "datetime"
    })
    availabilityDate: Date;

    @Column({
        type: "int"
    })
    duration: number;

    @Column({
        nullable: true
    })
    test: "string"

    @OneToOne(type => Appointment, appointment => appointment.availability, {
        cascade: true
    })
    appointment: Appointment
};
