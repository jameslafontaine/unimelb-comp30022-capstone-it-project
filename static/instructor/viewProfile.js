var usr = JSON.parse(document.getElementById('load-data').getAttribute('data-usr'));
document.getElementById('name').innerHTML = usr.firstName + '' + usr.lastName;
document.getElementById('id').innerHTML = usr.id;
document.getElementById('email').innerHTML = usr.email;