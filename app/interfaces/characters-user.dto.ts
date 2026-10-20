import type { CharacterDto } from "./characters-dto";
import type { JobsDto } from "./jobs-dto";

export interface CharactersUserDto {
    character: CharacterDto;
    job: JobsDto;
    level: number;
    id: number;
} 