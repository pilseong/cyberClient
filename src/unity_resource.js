function fetch(method, url, queryString, callback) {
  const thisClass = this;
  $.ajax({
    type: method,
    async: false,
    url: url,
    data: queryString,
    dataType: 'json',
    error: function (xhr, status, error) {
      callback(error, null);
    },
    success: function (data) {
      callback(null, data);
    }
  });
}