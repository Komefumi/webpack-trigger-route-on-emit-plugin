const jQuery = require("jquery");

function ensureURLExistsAsync(url) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url,
      dataType: "text",
      type: "GET",
      complete: function onPingComplete(xhr) {
        if (xhr.status == 200) resolve();
        else reject();
      },
    });
  });
}

module.exports = {
  ensureURLExistsAsync,
};
