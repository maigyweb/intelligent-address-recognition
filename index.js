import { REG, invalidRecognize } from "./utils/index";

function splitString(string) {
  let mobile = "";
  let leftStr = "";

  let phones = string.match(REG.PHONE);
  if (phones && phones.length > 0) {
    leftStr = string.replace(REG.PHONE, ",");
    mobile = phones[phones.length - 1];
  } else {
    phones = string.match(REG.SAME_PHONE);
    leftStr = string.replace(REG.SAME_PHONE, ",");
  }

  let arr = leftStr.split(REG.SPLIT_WITH_SPACE).filter((i) => !!i);
  if ((phones && arr.length > 2) || (!phones && arr.length > 3)) {
    arr = leftStr
      .split(REG.SPLIT)
      .filter((i) => !!i)
      .map((i) => i.replace(/\s+/g, ""));
  }

  return { mobile, arr };
}

function addressRecognize(addressList, addrString, addrKeys) {
  const { name = "name", value = "id", child = "child" } = addrKeys || {};
  let address = addrString;
  let provincename = "";
  let provinceid = "";
  let cityname = "";
  let cityid = "";
  let districtname = "";
  let districtid = "";
  let districtList = [];
  let prefixStr = "";

  function createRecognizeReg(area, areaUnity = "") {
    let areaFragment = "";
    for (let i = area.length; i >= 2; i--) {
      areaFragment += `${area.slice(0, i)}|`;
    }
    return RegExp(
      "([^" +
        areaFragment.slice(0, -1) +
        "])*(" +
        areaFragment.slice(0, -1) +
        ")" +
        areaUnity
    );
  }
  function matchList(list, curAddr) {
    return list
      .map((item) => {
        if (createRecognizeReg(item[name]).test(curAddr)) {
          const index = curAddr.indexOf(item[name].slice(0, 2));
          return { ...item, index, prefixStr: curAddr.slice(0, index) };
        }
      })
      .filter((i) => !!i)
      .sort((a, b) => a.index - b.index);
  }
  function districtRecognize() {
    if (!districtList || !districtList.length) return;
    const districtMatchList = matchList(districtList, address);
    if (districtMatchList.length > 0) {
      const district = districtMatchList[0];
      districtname = district[name];
      districtid = district[value];
      address = address.replace(
        createRecognizeReg(districtname, "(区|地区|新区|开发区|县|旗|市)?"),
        ""
      );
    }
  }

  const procinceMatchList = matchList(addressList, address);
  const cityMatchList = [];
  for (let i = 0; i < addressList.length; i++) {
    cityMatchList.push(
      ...matchList(addressList[i][child] || [], address).map((item) => ({
        ...item,
        provincename: addressList[i][name],
        provinceid: addressList[i][value],
        parentId: addressList[i][value],
      }))
    );
  }

  const list = procinceMatchList.concat(cityMatchList);
  if (list.length === 0) return false;
  const target = list.sort((a, b) => a.index - b.index)[0];
  if (!target.parentId || target.parentId === "0") {
    prefixStr = target.prefixStr;
    provincename = target[name];
    provinceid = target[value];
    const city = cityMatchList.filter(
      (item) => item.parentId === provinceid
    )[0];
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
    address = address.replace(
      createRecognizeReg(
        provincename,
        "(省|市|自治区|壮族自治区|回族自治区|维吾尔自治区)?"
      ),
      ""
    );
  }
  if (cityid) {
    address = address.replace(
      createRecognizeReg(cityname, "(市|州|自治州)?"),
      ""
    );
    districtRecognize();
  }

  if (!provinceid && !cityid) return false;
  return {
    provincename,
    provinceid,
    cityname,
    cityid,
    districtname,
    districtid,
    address,
    prefixStr,
  };
}

const contactInfoRecognize = (addressList, str, addrKeys) => {
  const { mobile, arr } = splitString(str);
  let recipient = "";
  let location = null;
  let locationIdx;

  arr.forEach((item, index) => {
    if (!item) return;
    if (invalidRecognize(item)) return;
    const newLocation = addressRecognize(addressList, item, addrKeys);
    if (newLocation) {
      if (location) {
        const checkKeys = ["provinceid", "cityid", "districtid"];
        const locationMatchKeys = checkKeys.filter((key) =>
          Boolean(location[key])
        );
        const newLocationMatchKeys = checkKeys.filter((key) =>
          Boolean(newLocation[key])
        );
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
  return { recipient, mobile, location };
};

export default contactInfoRecognize;
