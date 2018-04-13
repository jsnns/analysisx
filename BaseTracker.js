/**
 * Created by jacobsansbury on 3/22/18.
 */
"use strict";
import * as util from "./util";

/**
 * @typedef {Object} BaseTracker
 * @property {Function} encrypt - encrypt every key with customer as a substring
 * @property {Function} mutate - apply a function to every property of the event's data
 * @property {Function} log - log the event to console
 * @property {Function} add - add data to be tracked.
 * @property {Function} flatten - flatten object tree and separate sub-properties by '_'
 * @property {Function} apply - apply a whitelist or blacklist to event data
 */
export default class BaseTracker {
  constructor(type) {
    this.type = type;   // the type of the event
    this.data = {};     // the data to track with the event
  }

  /**
   * Encrypt all keys with a substring of 'customer'
   */
  encrypt() {
    this.mutate((key, value) => {
      if(key.indexOf('customer') > -1) return util.toSHA256(value);
      else return value;
    });
  }

  /**
   * Mutate all data fields with a function
   * @param {Function} f - function to apply to each key in data
   */
  mutate(f) {
    for (let key in this.data) {
      this.data[key] = f(key, this.data[key]);
    }
  }

  log() {
    console.log(this.type, this.data);
    return this;
  }

  /**
   * Deep Merges an object with the current payload
   * @param {Object} data - the object to mutate by
   * @returns {BaseTracker} - Usable for chaining
   */
  add(data) {
    this.data = util.mergeDeep(this.data, data);
    return this;
  }

  /**
   * Flattens the tracker payload by mutation
   * {
   *    version: 2,
   *    customer: {
   *      name: 'Jacob',
   *      id: 1
   *    }
   * } becomes {
   *    version: 2,
   *    customer_name: 'Jacob',
   *    customer_id: 1
   * }
   * @returns {BaseTracker} - Usable for chaining
   */
  flatten() {
    this.data = util.flattenObj(this.data);
    return this;
  }

  /**
   * Apply a blacklist and/or a whitelist
   * @param {Array} blacklist - removes each key in event data included in the array
   * @param {Array} whitelist - removes every except every key included in the array
   */
  apply(blacklist, whitelist) {
    if (blacklist) {
      blacklist.forEach(value => {
        delete this.data[value];
      });
    }

    if (whitelist) {
      this.data = whitelist.reduce((map, key) => {
        map[key] = this.data[key]
      });
    }
  }
};
