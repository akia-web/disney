import type { CompanionDto } from "./companion.dto";

export interface CompanionUserDto{
    id: number;
    companion: CompanionDto;
    isObtained: Boolean;
    
}