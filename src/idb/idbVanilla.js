/**
 * @file idbVanilla.js
 * This file provides a Promise-based API for interacting with IndexedDB
 * in a vanilla (non-ES modules) context.
 *
 * It attaches an "IDBWrapper" object to the global `window` object,
 * giving you three async functions:
 *   - addCost(costData)
 *   - getCostsForMonth(month, year)
 *   - getCategoryTotalsForMonth(month, year)
 *
 * Usage in a simple HTML file:
 *   <script src="idbVanilla.js"></script>
 *   <script>
 *     IDBWrapper.addCost({ sum: 100, category: 'Food', date: '2025-01-01' })
 *       .then(id => console.log('New cost ID:', id))
 *       .catch(err => console.error(err));
 *   </script>
 */

(function () {
    const DB_NAME = 'CostManagerDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'costs';

    /**
     * Opens or creates the IndexedDB database, returning a Promise.
     * @returns {Promise<IDBDatabase>}
     */
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('byDate', 'date', { unique: false });
                    store.createIndex('byCategory', 'category', { unique: false });
                }
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Adds a new cost record to the "costs" store.
     * @param {{ sum: number, category: string, description?: string, date: string }} costData
     * @returns {Promise<number>} The auto-generated ID of the new record.
     */
    async function addCost(costData) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.add(costData);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Retrieves all cost records that match a given month and year.
     * @param {number} month - 1 through 12
     * @param {number} year - four-digit year, e.g. 2025
     * @returns {Promise<Array<object>>} Array of matching cost objects.
     */
    async function getCostsForMonth(month, year) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                const allCosts = request.result;
                const filtered = allCosts.filter((cost) => {
                    const d = new Date(cost.date);
                    return (d.getMonth() + 1 === month && d.getFullYear() === year);
                });
                resolve(filtered);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Returns total costs per category for a given month & year.
     * @param {number} month - 1 through 12
     * @param {number} year - four-digit year, e.g. 2025
     * @returns {Promise<Array<{ category: string, total: number }>>}
     */
    async function getCategoryTotalsForMonth(month, year) {
        const costs = await getCostsForMonth(month, year);
        const totalsMap = {};

        costs.forEach((item) => {
            const cat = item.category || 'Uncategorized';
            if (!totalsMap[cat]) {
                totalsMap[cat] = 0;
            }
            totalsMap[cat] += item.sum;
        });

        // Convert map to an array
        return Object.keys(totalsMap).map((cat) => ({
            category: cat,
            total: totalsMap[cat],
        }));
    }

    // Attach to window for global usage:
    window.IDBWrapper = {
        addCost,
        getCostsForMonth,
        getCategoryTotalsForMonth,
    };
})();
