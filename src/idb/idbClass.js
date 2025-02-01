/**
 * @file idbClass.js
 * @class IndexedDBHandler
 * This file provides a class for handling IndexedDB operations.
 *
 * @exports idb
 * @createdBy Yotam Haimovitch & Raziel Otick
 */
class IndexedDBHandler {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    /**
     * Open the IndexedDB database.
     * @returns {Promise<unknown>} - The promise object representing the operation
     */
    async openCostsDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

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
    async addCost(cost) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("costs", "readwrite");
            const store = transaction.objectStore("costs");
            const request = store.add(cost);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(false);
            };
        });
    }
}

/**
 * IndexedDB module.
 * @type {{openCostsDB: (function(dbName, version): Promise<unknown>)}}
 */
export const idbClass = {
    openCostsDB: async (dbName, version) => {
        const handler = new IndexedDBHandler(dbName, version);
        return handler.openCostsDB();
    }
};
