import {
    Connection,
    Repository,
    createConnection
} from "typeorm";
import { AvailabilityController } from "./availability.controller";
import { Availability } from "../../entity/availability";
import { HTTP400Error } from "../../utils/httpErrors";
import { Appointment } from "../../entity/appointment";

describe("AvailabilityController", () => {
    let connection: Connection;
    let repository: Repository<Availability>;
    let controller: AvailabilityController;

    beforeAll(async () => {
        connection = await createConnection("unit");
        repository = connection.getRepository(Availability);
        controller = new AvailabilityController(repository);
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

    test("should not allow endDate prior to startDate", async () => {
        var startDate = new Date("2020-01-01");
        var endDate = new Date("2019-12-31");

        await expect(controller.getAvailabilityByDateRange(startDate, endDate)).rejects.toThrow(HTTP400Error);
    });

    test("should not allow endDate to be the same as startDate", async () => {
        var startDate = new Date("2020-01-01");
        var endDate = new Date("2020-01-01");

        await expect(controller.getAvailabilityByDateRange(startDate, endDate)).rejects.toThrow(HTTP400Error);
    });

    test("should find one availability within the date range", async () => {
        let availability1 = new Availability();
        availability1.availabilityDate = new Date(new Date("2020-01-01").toISOString());
        availability1.duration = 60;

        let availability2 = new Availability();
        availability2.availabilityDate = new Date(new Date("2020-01-02").toISOString());
        availability2.duration = 90;
        await repository.save([
            availability1, availability2
        ]);

        var startDate = new Date("2019-12-31");
        var endDate = new Date("2020-01-01");

        var result = await controller.getAvailabilityByDateRange(startDate, endDate);
        expect(result.length).toEqual(1);
        expect(result[0].duration).toEqual(60);
    });

    test("should find both availabilities within the date range", async () => {
        let availability1 = new Availability();
        availability1.availabilityDate = new Date(new Date("2020-01-01").toISOString());
        availability1.duration = 60;

        let availability2 = new Availability();
        availability2.availabilityDate = new Date(new Date("2020-01-02").toISOString());
        availability2.duration = 90;
        await repository.save([
            availability1, availability2
        ]);

        var startDate = new Date("2019-12-31");
        var endDate = new Date("2020-01-03");

        var result = await controller.getAvailabilityByDateRange(startDate, endDate);
        expect(result.length).toEqual(2);
    });

    test("should be able to add availability without id collision", async () => {
        let availability = new Availability();
        availability.availabilityDate = new Date("2019-01-01");
        availability.duration = 60;

        var result = await controller.createAvailability(availability);

        expect(result).toBeDefined();
        expect(result.availabilityId).toBeGreaterThan(0);

        let availability2 = new Availability();
        availability2.availabilityDate = new Date("2019-01-01");
        availability2.duration = 60;

        var result2 = await controller.createAvailability(availability2);

        expect(result2).toBeDefined();
        expect(result2.availabilityId).toBeGreaterThan(0);
        expect(result2.availabilityId).not.toEqual(result.availabilityId);
    });

    test("should not be able to update availability without an id", async () => {
        let availability = new Availability();
        availability.availabilityDate = new Date("2019-01-01");
        availability.duration = 60;

        await controller.createAvailability(availability);

        let updateAvailability = new Availability();
        availability.availabilityDate = new Date("2019-01-02");
        availability.duration = 90;

        await expect(controller.updateAvailability(updateAvailability))
            .rejects.toThrow(HTTP400Error);
    });

    test("should be able to update availability", async () => {
        let availability = new Availability();
        availability.availabilityDate = new Date("2019-01-01");
        availability.duration = 60;

        var savedAvailability = await controller.createAvailability(availability);

        let updateAvailability = new Availability();
        updateAvailability.availabilityDate = new Date("2019-01-02");
        updateAvailability.duration = 90;
        updateAvailability.availabilityId = savedAvailability.availabilityId;

        let result = await controller.updateAvailability(updateAvailability);

        expect(result).toBeDefined();
        expect(result.availabilityId).toEqual(savedAvailability.availabilityId);
        expect(result.availabilityDate.toISOString()).toEqual(updateAvailability.availabilityDate.toISOString());
        expect(result.duration).toEqual(updateAvailability.duration);
    });

    test("should find one availability within the date range with appointment data", async () => {
        let availability = new Availability();
        availability.availabilityDate = new Date(new Date("2020-01-01").toISOString());
        availability.duration = 60;

        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";

        availability.appointment = appointment;
        await repository.save(availability);

        var startDate = new Date("2019-12-31");
        var endDate = new Date("2020-01-01");

        var result = await controller.getAvailabilityByDateRange(startDate, endDate);
        expect(result.length).toEqual(1);
        expect(result[0].duration).toEqual(60);
        expect(result[0].appointment).toBeDefined();
        expect(result[0].appointment.email).toEqual(appointment.email);
        expect(result[0].appointment.phone).toEqual(appointment.phone);
    });

    test("should find one availability with appointment", async () => {
        let availability = new Availability();
        availability.availabilityDate = new Date(new Date("2020-01-01").toISOString());
        availability.duration = 60;

        let appointment = new Appointment();
        appointment.email = "nathan.gudritz@gmail.com";
        appointment.phone = "2489218105";

        availability.appointment = appointment;
        const savedAvailability = await repository.save(availability);

        var result = await controller.getAvailabilityById(savedAvailability.availabilityId);

        expect(result).toBeDefined();

        if (result) {
            expect(result.appointment).toBeDefined();
        }
    });
});