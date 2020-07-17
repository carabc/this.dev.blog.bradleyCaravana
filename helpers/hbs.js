const moment = require("moment");

module.exports = {
  formatDate(date, format) {
    return moment(date).format(format);
  },

  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },

  stripTagsAndTruncate: function (str, len) {
    let newStr = str.replace(/<(?:.|\n)*?>/gm, "");

    if (newStr.length > len && newStr.length > 0) {
      let new_str = newStr + " ";
      new_str = newStr.substr(0, len);
      new_str = newStr.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : newStr.substr(0, len);
      return new_str + "...";
    }
    return newStr;
  },

  testIfImLoggedIn: function (loggedInUser, myGoogleId) {
    return loggedInUser._id === myGoogleId;
  },

  makeNewPostButton: function () {
    return `<a href="blog/new" class="floating-btn"><i class="fas fa-plus"></i></a>`;
  },
};
