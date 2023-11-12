/** 
 * Author: Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: Helper functions for dealing with app headers
 */

/**
 * *****************
 * @param {JUN} header - *****************
 * @returns {JUN}
 */
export function getGlobalAppHeadersValue(header) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    return tempHeaders.get(header);
}

/**
 * Loads JSON data from given url
 * @param {JUN} header - *******************
 * @param {JUN} value -  *******************
 */
export function setGlobalAppHeaders(header, value) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    tempHeaders.set(header, value);
    sessionStorage.setItem('globalAppHeaders', JSON.stringify(Object.fromEntries(tempHeaders.entries())));
}
