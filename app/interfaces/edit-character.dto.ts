import type { CharacterDto } from "./characters-dto";
import type { JobsDto } from "./jobs-dto";

export interface EditCharacterDto {
    character: CharacterDto;
    level: string;
    job: JobsDto;
    checked: boolean;
    id?: number
}