import { Repository } from "typeorm";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as env from "../../config/envConfig";

import { Appointment } from "../../entity/appointment";
import { HTTP400Error } from "../../utils/httpErrors";

@Service()
export class AppointmentController {
    constructor(
        @InjectRepository(Appointment, env.databaseConnName)
        private appointmentRepository: Repository<Appointment>) {
    }

    public async createAppointment(appointment: Appointment): Promise<Appointment> {
        return this.appointmentRepository.save(appointment);
    }

    public async updateAppointment(appointment: Appointment): Promise<Appointment> {
        if (!appointment.appointmentId || appointment.appointmentId <= 0) {
            throw new HTTP400Error("An id is required to update appointment");
        }

        return this.appointmentRepository.save(appointment);
    }

    public async getAppointmentById(appointmentId: number): Promise<Appointment | undefined> {
        if (!appointmentId || appointmentId <= 0) {
            throw new HTTP400Error("An id is required to update appointment");
        }

        return this.appointmentRepository.findOne({
            appointmentId: appointmentId
        }, {
            relations: ["availability"]
        });
    }

    public async getAppointmentByEmailOrPhone(emailOrPhone: string): Promise<Appointment[]> {
        if (!emailOrPhone) {
            throw new HTTP400Error("An email or phone is required");
        }

        return this.appointmentRepository.find({
            where: [
                {
                    email: emailOrPhone
                },
                {
                    phone: emailOrPhone
                }
            ],
            relations: ["availability"]
        });
    }
}
