import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    animals,
    NumberDictionary,
} from "unique-names-generator"

const numbers = NumberDictionary.generate({ min: 1000, max: 9999 })
const config: Config = {
    dictionaries: [adjectives, animals, numbers],
    length: 3,
    separator: "",
    style: "capital",
}
export function generateRandomName() {
    return uniqueNamesGenerator(config)
}
