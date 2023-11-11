/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 15, 2023
 * Description: Handles student detail functionality
 */


function fillStudentDetailsBox(student) {
    document.getElementById('studentName').innerHTML = student.first_name + ' ' + student.last_name
    document.getElementById('studentId').innerHTML = student.user_id
    document.getElementById('studentEmail').innerHTML = student.email
}
