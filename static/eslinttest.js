var module = angular.module('uploader', []);
/**
 * XMLHttpRequest wrapper that supports file upload progress since $http doesn't
 *
 * Usage similar to $http, returns a promise from the send method
 */
module.service('uploader', ['$q', function($q) {
  function readyStateChange(deferred, xhr) {
    if(xhr.readyState == 4) {
      if(xhr.status == 200) {
        deferred.resolve(JSON.parse(xhr.responseText));
      }
      else {
        deferred.reject('HTTP status ' + xhr.status);
      }
    }
  }
 
  function onProgress(deferred, xhr, ev) {
    if(ev.lengthComputable) {
      deferred.notify({ loaded: ev.loaded, total: ev.total });
    }
  }
 
  return {
    send: function(url, data) {
      var fd = new FormData();
      for(var k in data) {
        fd.append(k, data[k]);
      }
 
      var d = $q.defer();
 
      var xhr = new XMLHttpRequest();
 
      xhr.open('POST', url, true);
      xhr.onreadystatechange = readyStateChange.bind({}, d, xhr);
      xhr.upload.onprogress = onProgress.bind({}, d, xhr);
      xhr.send(fd);
 
      return d.promise;
    }
  };
}]);