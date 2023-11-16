# 智能地址识别、联系人信息识别
## 安装：

```javascript
yarn add intelligent-address-recognize 
```

## 使用：
```javascript
import contactInfoRecognize from 'intelligent-address-recognize'

contactInfoRecognize(addressList, string, addrKeys)
```


addressList: 全国省市区数据，树形结构  

string: 输入的文本


addrKeys?: { name, value, child }；addressList 的字段关键字
