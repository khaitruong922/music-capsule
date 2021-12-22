export const formatTimeMMSS = (secs: number) => {
	if (!secs) return `00:00`
	return new Date(secs * 1000).toISOString().slice(14, 19)
}
