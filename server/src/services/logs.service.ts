import { getLogs } from "@/utils/logger"

export const logService = {
    getAll(){
        return getLogs()
    }
}