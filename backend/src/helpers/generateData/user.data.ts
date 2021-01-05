import { setRandomFallback } from "bcryptjs"
import { setFlagsFromString } from "v8"

export const user = (data: object) => {
    if(!Object.keys(data).length) {
        return false;
    }
}