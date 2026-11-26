import type { GameEnum } from "~/enum/game.enum";
import type { JobsDto } from "./jobs-dto";
import type { CompanionAvailabilityDto } from "./companionAvailability.dto";

export interface CompanionDto{
    id?: number;
    name: string;
    image: string;
    job:JobsDto;
    game:GameEnum;
    region: string;
    loveName: string;                  
    loveImage: string;
    availabilities: CompanionAvailabilityDto[];
}