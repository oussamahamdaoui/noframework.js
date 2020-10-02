/**
 *
 * @param {String} string
 * @return {String}
 */

const escape = (string) => {
    const htmlReg = /["'&<>]/;
    const str = `${string}`;
    const match = htmlReg.exec(str);
    if (!match) {
      return str;
    }
    let escaped = '';
    let ret = '';
    let index = 0;
    let lastIndex = 0;
  
    for (index = match.index; index < str.length; index += 1) { //eslint-disable-line
      switch (str.charCodeAt(index)) {
        case 34:
          escaped = '&quot;';
          break;
        case 38:
          escaped = '&amp;';
          break;
        case 39:
          escaped = '&#39;';
          break;
        case 60:
          escaped = '&lt;';
          break;
        case 62:
          escaped = '&gt;';
          break;
        default:
          // eslint-disable-next-line no-continue
          continue;
      }
      if (lastIndex !== index) {
        ret += str.substring(lastIndex, index);
      }
      lastIndex = index + 1;
      ret += escaped;
    }
    return lastIndex !== index ? ret + str.substring(lastIndex, index) : ret;
  };

  module.exports = escape;