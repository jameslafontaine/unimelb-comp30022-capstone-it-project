/** 
 * Author: Callum Sharman, James La Fontaine, Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: The entrypoint of everything good and holy Javascript related
 */

import { createHeader } from './modules/webHeaderModule.js';
import { getGlobalAppHeadersValue } from './modules/helperFunctionModule.js';
import { generateStudentCases } from './modules/tableCreationModule.js';
import { loadData } from './modules/dataModule.js';

/**
 * Student View functions
 */
export function sHome() {
    createHeader("student");
    loadData('/api/data/cases/?userid=' + getGlobalAppHeadersValue('user_id'), {}) 
        .then(data => {
            generateStudentCases(data.cases);
        })
        .catch(error => {
            throw error;
        });
    fixStyling();
}
