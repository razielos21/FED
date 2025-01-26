/**
 * @file idbModule.js
 * This file provides a Promise-based API for interacting with IndexedDB,
 * intended for use in a React environment (ES Modules).
 *
 * Database: "CostManagerDB" (version 1)
 * Object Store: "costs"
 *   - keyPath: "id" (autoIncrement)
 *   - sum, category, description, date (string in YYYY-MM-DD format)
 *   - indexes: "byDate", "byCategory"
 *
 * Exports:
 *   addCost(costData): Promise<number>
 *   getCostsForMonth(month, year): Promise<Array<object>>
 *   getCategoryTotalsForMonth(month, year): Promise<Array<{ category: string, total: number }>>
 *
 * Example usage:
 *   import { addCost, getCostsForMonth } from './idbModule.js';
 *   await addCost({ sum: 100, category: 'Food', description: 'Pizza', date: '2025-01-15' });
 *   const costs = await getCostsForMonth(1, 2025);
 */

const DB_NAME = 'CostManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'costs';

/**
 * Opens (or creates) the IndexedDB database, returning a Promise for the database instance.
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
 * @param {{ sum: number, category: string, description: string, date: string }} costData
 *  - sum: numeric amount of the cost
 *  - category: e.g., "Food", "Rent", "Entertainment"
 *  - description: extra info about the cost
 *  - date: string in YYYY-MM-DD format
 * @returns {Promise<number>} Promise resolving to the auto-generated ID of the new record.
 */
export async function addCost(costData) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.add(costData);

        request.onsuccess = () => {
            resolve(request.result); // The new record's ID
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Retrieves all cost records that match a given month and year.
 * @param {number} month - 1-12
 * @param {number} year - four-digit year (e.g., 2025)
 * @returns {Promise<Array<object>>} Array of cost objects matching the date filter.
 */
export async function getCostsForMonth(month, year) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const allCosts = request.result;
            // Filter by the specified month and year
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
 * Calculates total costs per category for the given month and year.
 * @param {number} month - 1-12
 * @param {number} year - four-digit year (e.g., 2025)
 * @returns {Promise<Array<{ category: string, total: number }>>}
 *   An array of objects, each containing { category, total }
 */
export async function getCategoryTotalsForMonth(month, year) {
    // Reuse getCostsForMonth, then aggregate
    const costs = await getCostsForMonth(month, year);
    const totalsMap = {};

    costs.forEach((cost) => {
        const cat = cost.category || 'Uncategorized';
        if (!totalsMap[cat]) {
            totalsMap[cat] = 0;
        }
        totalsMap[cat] += cost.sum;
    });

    // Convert the map into an array suitable for charts
    const result = Object.keys(totalsMap).map((cat) => ({
        category: cat,
        total: totalsMap[cat],
    }));

    return result;
}

/**
 * Calculates total costs per category for an entire year.
 * @param {number} year - four-digit year (e.g., 2025)
 * @returns {Promise<Array<{ category: string, total: number }>>}
 */
export async function getCategoryTotalsForYear(year) {
    // 1) Open DB, read all records
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const allCosts = request.result;
            // 2) Filter by year
            const filtered = allCosts.filter((cost) => {
                const d = new Date(cost.date);
                return d.getFullYear() === year;
            });
            // 3) Aggregate totals by category
            const totalsMap = {};
            filtered.forEach((item) => {
                const cat = item.category || 'Uncategorized';
                if (!totalsMap[cat]) {
                    totalsMap[cat] = 0;
                }
                totalsMap[cat] += item.sum;
            });
            // 4) Convert map to array
            const result = Object.keys(totalsMap).map((cat) => ({
                category: cat,
                total: totalsMap[cat],
            }));
            resolve(result);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Returns an array of the last N items added, sorted descending by date or ID.
 * Example: sort by 'id' descending (assuming 'id' auto-increments).
 */
export async function getLastNItems(n = 15) {
    const db = await openDB(); // your openDB function
    const tx = db.transaction('costs', 'readonly');
    const store = tx.objectStore('costs');

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            let allCosts = request.result;
            // Sort by 'id' descending (assuming each record has an autoIncrement 'id')
            // If you prefer sorting by date, you'd parse cost.date and sort by time desc.
            allCosts.sort((a, b) => b.id - a.id);
            // Take the first N items
            const lastN = allCosts.slice(0, n);
            resolve(lastN);
        };
        request.onerror = () => reject(request.error);
    });
}


