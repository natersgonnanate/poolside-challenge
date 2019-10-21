import { Connection,
            Repository,
            createConnection } from "typeorm";
import { AvailabilityController } from "./availability.controller";
import { Availability } from "../../entity/availability";
import { HTTP400Error } from "../../utils/httpErrors";

describe("AvailabilityController", () => {
    let connection: Connection;
    let repository: Repository<Availability>;
    let controller: AvailabilityController;

    beforeAll(async () => {
        connection = await createConnection("unit");
        repository = connection.getRepository(Availability);
        controller = new AvailabilityController(repository);
    });

    afterEach(async () => {
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
        var availability1: Availability = {
            availabilityDate: new Date(new Date("2020-01-01").toISOString()),
            duration: 60
        };
        var availability2: Availability = {
            availabilityDate: new Date(new Date("2020-01-02").toISOString()),
            duration: 90
        };
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
        var availability1: Availability = {
            availabilityDate: new Date(new Date("2020-01-01").toISOString()),
            duration: 60
        };
        var availability2: Availability = {
            availabilityDate: new Date(new Date("2020-01-02").toISOString()),
            duration: 90
        };
        await repository.save([
            availability1, availability2
        ]);

        var startDate = new Date("2019-12-31");
        var endDate = new Date("2020-01-02");

        var result = await controller.getAvailabilityByDateRange(startDate, endDate);
        expect(result.length).toEqual(2);
    });
});