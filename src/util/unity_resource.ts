declare var $: any;

export function fetch(method: string, url: string, queryString: any, callback: any) {
  // const thisClass = this;
  $.ajax({
    type: method,
    async: false,
    url: url,
    data: queryString,
    dataType: 'json',
    error: function (xhr: any, status: any, error: any) {
      callback(error, null);
    },
    success: function (data: any) {
      callback(null, data);
    }
  });
}

export function fetchMultiPart(url: string, queryForm: any, callback: any) {
  // const thisClass = this;
  $.ajax({
    type: 'POST',
    async: false,
    enctype: 'multipart/form-data',
    url: url,
    data: queryForm,
    dataType: 'json',
    contentType: false,
    processData: false,
    error: function (xhr: any, status: any, error: any) {
      callback(error, null);
    },
    success: function (data: any) {
      callback(null, data);
    }
  });
}
