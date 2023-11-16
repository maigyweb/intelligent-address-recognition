const REG = {
  SPLIT: /[^\u4e00-\u9fa5a-zA-Z0-9\-\s]/g, // 拆分字符，空格不被拆分，保留
  SPLIT_WITH_SPACE: /[^\u4e00-\u9fa5a-zA-Z0-9-]/g, // 拆分字符，包含空格
  PHONE:
    /(((\+86|\+86-)|(86|86-)|(0086|0086-))?1[3-9]\d{9})|(0\d{2,3}-\d{7,8})/g, // 手机号、座机号
  SAME_PHONE:
    /(((\+86|\+86-)|(86|86-)|(0086|0086-))?\d{9,13})|(0\d{2,3}-\d{5,10})/g, // 类似手机号、座机号
  INVALID: /^\d?-?\d+$/,
};

// 无意义文本识别
function invalidRecognize(strItem) {
  return REG.INVALID.test(strItem);
}

export { REG, invalidRecognize };
