module.exports = {
    port: process.env.PORT || 3000,
    realm: process.env.REALM || 'http://localhost:3000/',
    db: {
        URI: process.env.DBURI || 'mongodb://localhost:27017/chat',
        retry: process.env.DBRETRY || 5
    }
}