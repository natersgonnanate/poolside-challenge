import { Repository, Between } from "typeorm";
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

    public async getAvailabilityByDateRange(startDate: Date, endDate: Date): Promise<Availability[]> {
        if (endDate <= startDate) {
            throw new HTTP400Error("endDate must be after startDate");
        }

        return this.availabilityRepository.find({
            where: {
                availabilityDate: Between(startDate.toISOString(), endDate.toISOString())
            }
        });
    }
}
