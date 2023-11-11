/** 
 * Author: Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: All functions headers related
 */

/**
 * Get value of a header 
 */
export function getGlobalAppHeadersValue(header) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    return tempHeaders.get(header);
}
