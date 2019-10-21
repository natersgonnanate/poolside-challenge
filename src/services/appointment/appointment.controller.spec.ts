import {
    Connection,
    Repository,
    createConnection
} from "typeorm";
import { AppointmentController } from "./appointment.controller";
import { Appointment } from "../../entity/appointment";
import { HTTP400Error } from "../../utils/httpErrors";
import { Availability } from "../../entity/availability";

describe("AppointmentController", () => {
    let connection: Connection;
    let repository: Repository<Appointment>;
    let controller: AppointmentController;

    beforeAll(async () => {
        connection = await createConnection("unit");
        repository = connection.getRepository(Appointment);
        controller = new AppointmentController(repository);
    });

    beforeEach(async () => {
        if (!connection.isConnected) {
            await connection.connect();
        }
        await connection.synchronize(true);
    });

    afterAll(async () => {
        await connection.close();
    });

    test("should be defined", async () => {
        expect(controller).toBeDefined();
    });

    test("should find appointment by email or phone", async () => {
        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";
        await repository.save(appointment);

        var result = await controller.getAppointmentByEmailOrPhone("nathan.gudritz@gmail.com");
        var result2 = await controller.getAppointmentByEmailOrPhone("2489218105");

        expect(result).toBeDefined();
        expect(result2).toBeDefined();
        expect(result.length).toBe(1);
        expect(result2.length).toBe(1);
        expect(result2[0].appointmentId).toBe(result[0].appointmentId);
    });

    test("should be able to add availability without id collision", async () => {
        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";

        var result = await controller.createAppointment(appointment);

        expect(result).toBeDefined();
        expect(result.appointmentId).toBeGreaterThan(0);

        let appointment2 = new Appointment();
        appointment2.email = "nathan.gudritz2@gmail.com";
        appointment2.phone = "2489218106";

        var result2 = await controller.createAppointment(appointment2);

        expect(result2).toBeDefined();
        expect(result2.appointmentId).toBeGreaterThan(0);
        expect(result2.appointmentId).not.toEqual(result.appointmentId);
    });

    test("should not be able to update an appointment without an id", async () => {
        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";

        await controller.createAppointment(appointment);

        let updateAppointment = new Appointment();
        updateAppointment.email = "nathan.gudritz2@gmail.com";
        updateAppointment.phone = "2489218106";

        await expect(controller.updateAppointment(updateAppointment))
            .rejects.toThrow(HTTP400Error);
    });

    test("should be able to update appointment", async () => {
        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";

        let savedAppointment = await controller.createAppointment(appointment);

        let updateAppointment = new Appointment();
        updateAppointment.email = "nathan.gudritz2@gmail.com";
        updateAppointment.phone = "2489218106";
        updateAppointment.appointmentId = savedAppointment.appointmentId;

        let result = await controller.updateAppointment(updateAppointment);

        expect(result).toBeDefined();
        expect(result.appointmentId).toEqual(savedAppointment.appointmentId);
        expect(result.email).not.toEqual(savedAppointment.email);
        expect(result.phone).not.toEqual(savedAppointment.phone);
    });

    test("should be able to create appointment associated to availability", async () => {
        const availabilityRepository = connection.getRepository(Availability);
        
        let availability = new Availability();
        availability.availabilityDate = new Date("2019-01-01");
        availability.duration = 60;
        let savedAvailability = await availabilityRepository.save(availability);
        
        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";
        appointment.availability = savedAvailability;

        const result = await controller.createAppointment(appointment);

        expect(result).toBeDefined();
        expect(result.appointmentId).toBeGreaterThan(0);
        expect(result.availability).toBeDefined();
        expect(result.availability.availabilityId).toBe(savedAvailability.availabilityId);
    });
});