import api from "src/common/api"

const DOWNLOAD_ROUTE = "/download"
const DOWNLOAD_MP3_ROUTE = `${DOWNLOAD_ROUTE}/mp3`

const getMp3DownloadUrl = (fileName: string) => {
    return `${api.defaults.baseURL}${DOWNLOAD_MP3_ROUTE}/${fileName}`
}

const downloadFile = (fileName: string) => {
    const link = document.createElement("a")
    link.href = getMp3DownloadUrl(fileName)
    link.target = "_blank"
    link.download = fileName
    link.click()
}

const DownloadService = {
    getMp3DownloadUrl,
    downloadFile,
}

export default DownloadService
