import type { CompanionDto } from "./companion.dto";

export interface CompanionAvailabilityDto {
    id?: number;
    day: string;
    from: string;
    to: string;
    companion?:CompanionDto;
}   