import { GameEnum } from "~/enum/game.enum"

export const translateGame = (game: GameEnum) => {
    switch (game) {
        case GameEnum.BASE_GAME: return 'Jeu de base'
        case GameEnum.DLC1: return 'DLC 1'
        case GameEnum.DLC2: return 'DLC 2'
        case GameEnum.DLC3: return 'DLC 3'
        case GameEnum.DLC4: return 'DLC 4'
        case GameEnum.ADVENTURE_PACK_1: return 'DLC Winnie'
        default: return game
    }
}