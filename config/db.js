
module.exports = (mongoose, env) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(env.db.URI);
    mongoose.set('debug', true);

    mongoose.connection.on('connected', () => {
        console.log(`Server ${process.pid} connected to db`);
    });

    let connRetry = env.db.retry;

    mongoose.connection.on('error', (err) => {
        if (connRetry > 0) {
            console.log(err);
            console.log(`Server ${process.pid} failed to connect to db ${connRetry}`);
            connRetry -= 1;
            mongoose.connect(env.db.URI);
        } else {
            console.error(`Server ${process.pid} failed to connect to db`)
        }
    })
}