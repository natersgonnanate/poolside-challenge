import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Availability {
    @PrimaryColumn()
    availabilityDate: Date = new Date();

    @Column()
    duration: number = 60;
};
