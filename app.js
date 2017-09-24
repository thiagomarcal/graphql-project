const express = require('express');
const log4js = require('log4js');
const config = require('./config.json');
const graphqlHTTP = require('express-graphql');
const MovieGraphQL = require('./graphQL/movie');

log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: config.LOG_PATH }
    },
    categories: {
        default: { appenders: [ 'out', 'app' ], level: 'debug' }
    }
});
const logger = log4js.getLogger();

let app = express();

let movieGraphQL = new MovieGraphQL('transformers');

movieGraphQL.loadRoot().then((root) => {
    app.use('/graphql', graphqlHTTP({
        schema: movieGraphQL.loadSchema(),
        graphiql: true,
        rootValue: root
    }));
});

app.listen(3000, ()=>{
    logger.info('listening ... ');
});