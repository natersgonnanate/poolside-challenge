import { Repository, Between, AdvancedConsoleLogger } from "typeorm";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as env from "../../config/envConfig";

import { Availability } from "../../entity/availability";
import { HTTP400Error } from "../../utils/httpErrors";

@Service()
export class AvailabilityController {
    constructor(
        @InjectRepository(Availability, env.databaseConnName)
        private availabilityRepository: Repository<Availability>) {
    }

    public async createAvailability(availability: Availability): Promise<Availability> {
        return this.availabilityRepository.save(availability);
    }

    public async updateAvailability(availability: Availability): Promise<Availability> {
        if (!availability.availabilityId || availability.availabilityId <= 0) {
            throw new HTTP400Error("An id is required to update availability");
        }

        return this.availabilityRepository.save(availability);
    }

    public async getAvailabilityById(availabilityId: number): Promise<Availability | undefined> {
        if (!availabilityId || availabilityId <= 0) {
            throw new HTTP400Error("An id is required to update availability");
        }

        return this.availabilityRepository.findOne({
            availabilityId: availabilityId
        }, {
            relations: ["appointment"]
        });
    }

    public async getAvailabilityByDateRange(startDate: Date, endDate: Date): Promise<Availability[]> {
        if (endDate <= startDate) {
            throw new HTTP400Error("endDate must be after startDate");
        }

        return this.availabilityRepository.find({
            where: {
                availabilityDate: Between(startDate.toISOString(), endDate.toISOString())
            },
            relations: ["appointment"]
        });
    }
}
