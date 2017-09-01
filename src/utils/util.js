const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

export function getByteLen(val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    let rx = new RegExp(/[^\0-\xff]/ig);
    if (a.match(rx) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};
