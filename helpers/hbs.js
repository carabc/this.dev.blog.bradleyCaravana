const moment = require("moment");

module.exports = {
  formatDate(date, format) {
    return moment(date).format(format);
  },

  stripTagsAndTruncate: function (str, len) {
    let newStr = str.replace(/<(?:.|\n)*?>/gm, "").trim();

    arrOfText = newStr.split(" ").slice(0, len);
    newStr = arrOfText.join(" ") + "...";

    return newStr;
  },

  makeNewPostButton: function () {
    return `<a href="/blog/new" class="floating-btn"><i class="fas fa-plus"></i></a>`;
  },

  makeEditPostButton: function (postId) {
    return `<a href="/blog/edit/${postId}" class="floating-edit-btn"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
</a>`;
  },
};
