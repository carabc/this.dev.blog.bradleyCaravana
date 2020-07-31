const moment = require("moment");

module.exports = {
  formatDate(date, format) {
    return moment(date).format(format);
  },

  stripTagsAndTruncate: function (str, len) {
    // A regular expression to find HTML tags in the string. Parse the parameter 'str' for HTML tags, find & replace them with nothing.
    let newStr = str.replace(/<[^>]*>/gm, "").trim();

    // 1.) Use the .split() string method to turn the string into an array, each word of the string being an array item. Use .slice(), an array method, to return a shallow copy of the original array that starts at the first array item and ends at the 'len' parameter.
    arrOfText = newStr.split(" ").slice(0, len);
    console.log(arrOfText);
    // 2.) Use .join() to join each item of the array on a space and turn it back into a string. Add the "..." at the end to tell the user to read more.
    newStr = arrOfText.join(" ") + "...";

    return newStr;
  },

  makeNewPostButton: function () {
    return `<a href="/blog/new" class="btn floating-new-post"><i class="fas fa-plus"></i></a>`;
  },

  makeEditPostButton: function (postId) {
    return `<a href="/blog/edit/${postId}" class="btn floating-edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
</a>`;
  },
};
