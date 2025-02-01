const idb = {};

idb.openCostsDB = async function (dbName, version) {
    return new Promise((resolve, reject) => {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        if (!window.indexedDB) {
            reject('IndexedDB not supported');
        }

        this.dbName = dbName;
        this.version = version;

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

idb.addCost = async function (cost) {
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