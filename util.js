/**
 * Created by jacobsansbury on 3/23/18.
 */
"use strict";
import forge from 'node-forge';

/**
 * Wrap an object to create a singleton
 * @param {*} obj - the object to make Singleton
 * @returns {function()}
 */
export const Singleton = obj => { // TODO: make more usable
  return () => {
    var instance;

    function createInstance() {
      var manager = new obj(...arguments);
      return manager;
    }

    return function () {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
};

/**
 * sha256 encrypts the input
 * @param string - the input
 * @returns {string} - the sha256 encrypted input
 */
export const toSHA256 = string => {
  const md = forge.md.sha256.create();
  md.update(string);                      // set byte buffer for Forge obj to the value passed
  return md.digest().toHex();             // return the hex representation of the digested string
}

/**
 * Recursive function used to flatten an event's payload
 * @param obj
 * @param prefix
 * @returns {Object}
 */
export const flattenObj = (obj, prefix) => { // TODO: Cleanup this function to take advantage of it's recursive nature
  let payload = {};
  for (let key in obj) {
    const item = obj[key];

    if (!isObject(item))
      payload[prefix ? `${prefix}_${key}` : key] = item || undefined;
    else {
      payload = Object.assign(payload, flattenObj(item, prefix ? `${prefix}_${key}` : key));
    }
  }
  return payload;
};

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {[key]: {}});
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * Not currently used
 * @param prototype
 * @param properties
 * @returns {*}
 */
export const shouldAssign = (prototype, properties) => {
  let v = null;
  if (!prototype) return {};
  for (let key in properties) {
    if (isObject(properties[key])) {
      properties[key] = shouldAssign(prototype[key], properties[key]);
    } else {
      const has = prototype.hasOwnProperty(key)
      if (!has) {
        delete properties[key];
      }
      v = !has ? key : null;
    }
  }
  return properties;
};
