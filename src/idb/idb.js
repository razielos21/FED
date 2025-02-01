/**
 * @file idb.js
 * This file provides a module for handling IndexedDB operations.
 *
 * @createdBy Yotam Haimovitch & Raziel Otick
 */

// The module object
const idb = {};

/**
 * Open the IndexedDB database.
 * @param dbName - The name of the database
 * @param version - The version of the database
 * @returns {Promise<unknown>}
 */
idb.openCostsDB = async function (dbName, version) {
    return new Promise((resolve, reject) => {
        // Check for support
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        // If not supported, reject the promise
        if (!window.indexedDB) {
            reject('IndexedDB not supported');
        }

        // Set the database name and version
        this.dbName = dbName;
        this.version = version;

        // Open the database
        const request = indexedDB.open(this.dbName, this.version);

        // Set the event handlers
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("costs")) {
                db.createObjectStore("costs", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            resolve(this);
        };

        request.onerror = (event) => {
            reject(`Error opening IndexedDB: ${event.target.errorCode}`);
        };
    });
}

/**
 * Add a cost to the IndexedDB database.
 * @param cost - The cost object to add
 * @returns {Promise<unknown>}
 */
idb.addCost = async function (cost) {
    return new Promise((resolve, reject) => {
        // Create a transaction and add the cost
        const transaction = this.db.transaction("costs", "readwrite");
        // Get the object store
        const store = transaction.objectStore("costs");
        // Add the cost
        const request = store.add(cost);

        // Set the event handlers
        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(false);
        };
    });
}
