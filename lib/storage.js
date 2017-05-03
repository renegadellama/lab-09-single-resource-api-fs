'use strict';

const debug = require('debug')('http:storage');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
const path = `${__dirname}/../data/`;
const storage = {};


module.exports = exports = {};

exports.createItem = function(schema, item) {
  debug('#createItem');

  if(!schema) return Promise.reject(new Error('schema required'));
  if(!item) return Promise.reject(new Error('item required'));
  if(!storage[schema]) storage[schema] = {};

  storage[schema][item.id] = item;
  let jsonItem = JSON.stringify(item);
  console.log(jsonItem);

  return fs.writeFileProm(`${__dirname}/../data/${item.id}.json`, jsonItem)
  .then(() => item)
  .catch(console.error);


};

exports.fetchItem = function(schema, id) {
  debug('#fetchItem');

  let urlPath = `${__dirname}/../data/${id}.json`;

  return fs.statProm(urlPath)
  .catch(err => {
    err.status = 404;
    return Promise.reject(err);
  })
  .then(() => {
    return fs.readFileProm(urlPath);
  })
  .then((data) => {
    return Promise.resolve(JSON.parse(data.toString()));
  });
};




exports.removeItem = function(schema, id) {
  debug('#removeItem');

  let urlPath = `${path}/${id}.json`;

  return fs.statProm(urlPath)
  .catch(err => {
    err.status = 404;
    return Promise.reject(err);
  })
  .then(() => {
    return fs.unlinkProm(urlPath);
  })
  .then(() => {
    return Promise.resolve();
  });
};

exports.putItem = function(schema, id) {
  debug('#putItem');

  let urlPath = `${__dirname}/../data/${id}.json`;

  return fs.writeFileProm(`${urlPath}`)
  .then( (item) => {
    console.log(item);
  })
  .catch(console.error);
};
