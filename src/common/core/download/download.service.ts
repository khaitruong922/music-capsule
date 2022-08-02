import api from "src/common/api"

const DOWNLOAD_ROUTE = "/download"
const DOWNLOAD_MP3_ROUTE = `${DOWNLOAD_ROUTE}/mp3`

const getMp3DownloadUrl = (fileName: string) => {
    return `${api.defaults.baseURL}${DOWNLOAD_MP3_ROUTE}/${fileName}`
}

const downloadFile = (fileName: string) => {
    const url = getMp3DownloadUrl(fileName)
    window.open(url, "_blank")
}

const DownloadService = {
    getMp3DownloadUrl,
    downloadFile,
}

export default DownloadService
