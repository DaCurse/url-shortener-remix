const { purgeExpiredSessions } = require('./db')

const PURGE_SESSIONS_INTERVAL = 14_400_000 // 4 Hours

function startCronJobs() {
  setInterval(async () => {
    const { count } = await purgeExpiredSessions()
    console.log(`Purged ${count} expired session(s)`)
  }, PURGE_SESSIONS_INTERVAL)
}

module.exports = { startCronJobs }
