const {buildSchema} = require('graphql');
const fetch = require('node-fetch');
const log4js = require('log4js');
const config = require('../config.json');
const logger = log4js.getLogger();


function loadSchema() {
    return buildSchema(`
      type Movie {
         title : String,
         description : String,
         url : String,
         release_date : String,
         poster : String,
         thumb : String
      }
    
      type Query {
        movie(title: String) : [Movie]
      }
    `);
}


function loadRoot(title) {
    return new Promise((resolve, reject) => {
        fetch(`${config.MOVIE_API}?title=${title}`)
            .then((res) => res.json())
            .then((body) => {
                resolve(body.map((item) => {
                    return {
                        title: item.title,
                        description: item.description,
                        url: item.url.url,
                        release_date: item.release_date,
                        poster: item.poster.large,
                        thumb: item.poster.thumb
                    }
                }));
            })
            .catch((err) => {
                logger.error(err);
                reject(err);
            })
    })

}

module.exports = {loadSchema, loadRoot};


