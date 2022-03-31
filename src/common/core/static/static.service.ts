import api from "src/common/api"

const STATIC_MP3_ROUTE = "/public/mp3"

const getMp3Url = (fileName: string) => {
    return `${api.defaults.baseURL}${STATIC_MP3_ROUTE}/${fileName}`
}

const StaticService = {
    getMp3Url,
}

export default StaticService
