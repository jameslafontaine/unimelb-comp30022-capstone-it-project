function getGlobalAppHeadersValue(header) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    return tempHeaders.get(header);
}

function setGlobalAppHeaders(header, value) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    tempHeaders.set(header, value);
    sessionStorage.setItem('globalAppHeaders', JSON.stringify(Object.fromEntries(tempHeaders.entries())));
    console.log(getGlobalAppHeadersValue(header));
}
