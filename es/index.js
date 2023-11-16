function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var REG = {
  SPLIT: /[^\u4e00-\u9fa5a-zA-Z0-9\-\s]/g,
  // 拆分字符，空格不被拆分，保留
  SPLIT_WITH_SPACE: /[^\u4e00-\u9fa5a-zA-Z0-9-]/g,
  // 拆分字符，包含空格
  PHONE: /(((\+86|\+86-)|(86|86-)|(0086|0086-))?1[3-9]\d{9})|(0\d{2,3}-\d{7,8})/g,
  // 手机号、座机号
  SAME_PHONE: /(((\+86|\+86-)|(86|86-)|(0086|0086-))?\d{9,13})|(0\d{2,3}-\d{5,10})/g,
  // 类似手机号、座机号
  INVALID: /^\d?-?\d+$/
};

// 无意义文本识别
function invalidRecognize(strItem) {
  return REG.INVALID.test(strItem);
}

function splitString(string) {
  var mobile = "";
  var leftStr = "";
  var phones = string.match(REG.PHONE);
  if (phones && phones.length > 0) {
    leftStr = string.replace(REG.PHONE, ",");
    mobile = phones[phones.length - 1];
  } else {
    phones = string.match(REG.SAME_PHONE);
    leftStr = string.replace(REG.SAME_PHONE, ",");
  }
  var arr = leftStr.split(REG.SPLIT_WITH_SPACE).filter(function (i) {
    return !!i;
  });
  if (phones && arr.length > 2 || !phones && arr.length > 3) {
    arr = leftStr.split(REG.SPLIT).filter(function (i) {
      return !!i;
    }).map(function (i) {
      return i.replace(/\s+/g, "");
    });
  }
  return {
    mobile: mobile,
    arr: arr
  };
}
function addressRecognize(addressList, addrString, addrKeys) {
  var _ref = addrKeys || {},
    _ref$name = _ref.name,
    name = _ref$name === void 0 ? "name" : _ref$name,
    _ref$value = _ref.value,
    value = _ref$value === void 0 ? "id" : _ref$value,
    _ref$child = _ref.child,
    child = _ref$child === void 0 ? "child" : _ref$child;
  var address = addrString;
  var provincename = "";
  var provinceid = "";
  var cityname = "";
  var cityid = "";
  var districtname = "";
  var districtid = "";
  var districtList = [];
  var prefixStr = "";
  function createRecognizeReg(area) {
    var areaUnity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var areaFragment = "";
    for (var i = area.length; i >= 2; i--) {
      areaFragment += "".concat(area.slice(0, i), "|");
    }
    return RegExp("([^" + areaFragment.slice(0, -1) + "])*(" + areaFragment.slice(0, -1) + ")" + areaUnity);
  }
  function matchList(list, curAddr) {
    return list.map(function (item) {
      if (createRecognizeReg(item[name]).test(curAddr)) {
        var index = curAddr.indexOf(item[name].slice(0, 2));
        return _objectSpread2(_objectSpread2({}, item), {}, {
          index: index,
          prefixStr: curAddr.slice(0, index)
        });
      }
    }).filter(function (i) {
      return !!i;
    }).sort(function (a, b) {
      return a.index - b.index;
    });
  }
  function districtRecognize() {
    if (!districtList || !districtList.length) return;
    var districtMatchList = matchList(districtList, address);
    if (districtMatchList.length > 0) {
      var district = districtMatchList[0];
      districtname = district[name];
      districtid = district[value];
      address = address.replace(createRecognizeReg(districtname, "(区|地区|新区|开发区|县|旗|市)?"), "");
    }
  }
  var procinceMatchList = matchList(addressList, address);
  var cityMatchList = [];
  var _loop = function _loop(i) {
    cityMatchList.push.apply(cityMatchList, _toConsumableArray(matchList(addressList[i][child] || [], address).map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        provincename: addressList[i][name],
        provinceid: addressList[i][value],
        parentId: addressList[i][value]
      });
    })));
  };
  for (var i = 0; i < addressList.length; i++) {
    _loop(i);
  }
  var list = procinceMatchList.concat(cityMatchList);
  if (list.length === 0) return false;
  var target = list.sort(function (a, b) {
    return a.index - b.index;
  })[0];
  if (!target.parentId || target.parentId === "0") {
    prefixStr = target.prefixStr;
    provincename = target[name];
    provinceid = target[value];
    var city = cityMatchList.filter(function (item) {
      return item.parentId === provinceid;
    })[0];
    if (city) {
      cityname = city[name];
      cityid = city[value];
      districtList = city[child] || [];
    }
  } else {
    prefixStr = target.prefixStr;
    cityname = target[name];
    cityid = target[value];
    provincename = target.provincename;
    provinceid = target.provinceid;
    districtList = target[child] || [];
  }
  if (provinceid) {
    address = address.replace(createRecognizeReg(provincename, "(省|市|自治区|壮族自治区|回族自治区|维吾尔自治区)?"), "");
  }
  if (cityid) {
    address = address.replace(createRecognizeReg(cityname, "(市|州|自治州)?"), "");
    districtRecognize();
  }
  if (!provinceid && !cityid) return false;
  return {
    provincename: provincename,
    provinceid: provinceid,
    cityname: cityname,
    cityid: cityid,
    districtname: districtname,
    districtid: districtid,
    address: address,
    prefixStr: prefixStr
  };
}
var contactInfoRecognize = function contactInfoRecognize(addressList, str, addrKeys) {
  var _splitString = splitString(str),
    mobile = _splitString.mobile,
    arr = _splitString.arr;
  var recipient = "";
  var location = null;
  var locationIdx;
  arr.forEach(function (item, index) {
    if (!item) return;
    if (invalidRecognize(item)) return;
    var newLocation = addressRecognize(addressList, item, addrKeys);
    if (newLocation) {
      if (location) {
        var checkKeys = ["provinceid", "cityid", "districtid"];
        var locationMatchKeys = checkKeys.filter(function (key) {
          return Boolean(location[key]);
        });
        var newLocationMatchKeys = checkKeys.filter(function (key) {
          return Boolean(newLocation[key]);
        });
        if (locationMatchKeys.length > newLocationMatchKeys.length) {
          recipient = item;
        } else {
          recipient = arr[locationIdx];
          location = newLocation;
          locationIdx = index;
        }
        return;
      }
      location = newLocation;
      locationIdx = index;
      !recipient && location.prefixStr && (recipient = location.prefixStr);
      return;
    }
    recipient = item;
  });
  return {
    recipient: recipient,
    mobile: mobile,
    location: location
  };
};

export { contactInfoRecognize as default };
