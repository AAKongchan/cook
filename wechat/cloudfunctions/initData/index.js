// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command

// 100个菜品数据
const goodsData = [
  // ========== 肉菜 (20个) ==========
  { id: 1, name: '糖醋排骨', description: '酸甜酥软 adorable~', price: 45, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '肉菜', isHot: true },
  { id: 2, name: '红烧肉', description: '肥而不腻入口即化', price: 48, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '肉菜' },
  { id: 3, name: '可乐鸡翅', description: '甜咸适中肉质嫩滑', price: 36, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: '肉菜', isNew: true },
  { id: 4, name: '宫保鸡丁', description: '花生配鸡肉香辣下饭', price: 32, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', category: '肉菜' },
  { id: 5, name: '回锅肉', description: '肥而不腻蒜苗飘香', price: 35, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', category: '肉菜' },
  { id: 6, name: '鱼香肉丝', description: '酸甜微辣经典川菜', price: 28, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', category: '肉菜', isHot: true },
  { id: 7, name: '东坡肉', description: '入口即化香甜可口', price: 52, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '肉菜' },
  { id: 8, name: '蜜汁叉烧', description: '甜蜜滋味港式风味', price: 42, image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400', category: '肉菜', isNew: true },
  { id: 9, name: '蒜蓉粉丝虾', description: '蒜香鲜美粉嫩可爱', price: 48, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', category: '肉菜' },
  { id: 10, name: '糖醋里脊', description: '外酥里嫩酸甜可口', price: 38, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=400', category: '肉菜', isHot: true },
  { id: 11, name: '酱牛肉', description: '酱香浓郁肉质紧实', price: 46, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400', category: '肉菜' },
  { id: 12, name: '京酱肉丝', description: '酱香浓郁卷入薄饼', price: 35, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400', category: '肉菜' },
  { id: 13, name: '孜然羊肉', description: '孜然香气扑鼻而来', price: 52, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '肉菜', isNew: true },
  { id: 14, name: '口水鸡', description: '麻辣鲜香鸡肉嫩滑', price: 38, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', category: '肉菜' },
  { id: 15, name: '蒜香骨', description: '蒜香四溢外酥里嫩', price: 44, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '肉菜' },
  { id: 16, name: '红烧狮子头', description: '肉质鲜嫩汤汁浓郁', price: 40, image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400', category: '肉菜', isHot: true },
  { id: 17, name: '梅菜扣肉', description: '咸香入味肥而不腻', price: 42, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '肉菜' },
  { id: 18, name: '黑椒牛柳', description: '黑椒香气牛肉鲜嫩', price: 48, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400', category: '肉菜' },
  { id: 19, name: '蒜香烤鸡', description: '蒜香烤至金黄酥脆', price: 45, image: 'https://images.unsplash.com/photo-1532550907401-a57141f2eefd?w=400', category: '肉菜', isNew: true },
  { id: 20, name: '香酥鸭', description: '外酥里嫩香气四溢', price: 50, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: '肉菜' },

  // ========== 素菜 (15个) ==========
  { id: 21, name: '番茄炒蛋', description: '经典家常菜酸甜可爱', price: 18, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', category: '素菜', isHot: true },
  { id: 22, name: '麻婆豆腐', description: '麻辣鲜香嫩滑入口', price: 22, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '素菜' },
  { id: 23, name: '地三鲜', description: '东北经典咸香下饭', price: 22, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '素菜', isNew: true },
  { id: 24, name: '干煸四季豆', description: '干香微辣口感爽脆', price: 24, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: '素菜' },
  { id: 25, name: '蚝油生菜', description: '清爽脆嫩蚝油提鲜', price: 15, image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400', category: '素菜', isHot: true },
  { id: 26, name: '蒜蓉西兰花', description: '清淡健康蒜香提味', price: 18, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400', category: '素菜' },
  { id: 27, name: '红烧茄子', description: '软糯入味酱香浓郁', price: 20, image: 'https://images.unsplash.com/photo-1594040291048-15a5db47f5e9?w=400', category: '素菜', isNew: true },
  { id: 28, name: '干锅花菜', description: '干香微辣下饭神器', price: 23, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '素菜' },
  { id: 29, name: '香菇青菜', description: '清新淡雅健康美味', price: 16, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: '素菜' },
  { id: 30, name: '醋溜土豆丝', description: '酸辣爽口开胃下饭', price: 14, image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber696?w=400', category: '素菜', isHot: true },
  { id: 31, name: '清炒荷兰豆', description: '清脆爽口颜色鲜绿', price: 20, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: '素菜' },
  { id: 32, name: '蒜蓉秋葵', description: '黏糯爽口健康营养', price: 22, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', category: '素菜' },
  { id: 33, name: '干煸杏鲍菇', description: '口感劲道香气四溢', price: 24, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '素菜', isNew: true },
  { id: 34, name: '家常豆腐', description: '外酥里嫩酱香浓郁', price: 20, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '素菜' },
  { id: 35, name: '炒时蔬', description: '时令蔬菜清新健康', price: 16, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: '素菜' },

  // ========== 汤菜 (15个) ==========
  { id: 36, name: '紫菜蛋花汤', description: '清爽鲜美暖心暖胃', price: 12, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜', isHot: true },
  { id: 37, name: '番茄蛋汤', description: '酸甜可口家常美味', price: 14, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 38, name: '玉米排骨汤', description: '清甜滋补营养满满', price: 35, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜', isNew: true },
  { id: 39, name: '冬瓜丸子汤', description: '清淡鲜美丸子Q弹', price: 28, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 40, name: '酸辣汤', description: '酸辣开胃暖心暖胃', price: 16, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 41, name: '鲫鱼豆腐汤', description: '奶白浓郁鲜美无比', price: 32, image: 'https://images.unsplash.com/photo-1626804475297-411d863b5285?w=400', category: '汤菜', isHot: true },
  { id: 42, name: '虫草花鸡汤', description: '滋补养生鲜美滋补', price: 38, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 43, name: '西湖牛肉羹', description: '滑嫩鲜美口感丰富', price: 26, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜', isNew: true },
  { id: 44, name: '丝瓜蛋汤', description: '清新淡雅夏日消暑', price: 15, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 45, name: '海带排骨汤', description: '鲜美滋补营养丰富', price: 32, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 46, name: '萝卜牛腩汤', description: '浓郁鲜美牛肉软烂', price: 38, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 47, name: '菌菇汤', description: '菌香四溢鲜美营养', price: 24, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜', isHot: true },
  { id: 48, name: '菠菜猪肝汤', description: '补血明目营养丰富', price: 28, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },
  { id: 49, name: '莲藕排骨汤', description: '清甜粉糯滋补美味', price: 35, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜', isNew: true },
  { id: 50, name: '老火靓汤', description: '慢火熬制营养精华', price: 42, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400', category: '汤菜' },

  // ========== 炖菜 (15个) ==========
  { id: 51, name: '东北乱炖', description: '一锅炖出家的味道', price: 38, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '炖菜', isHot: true },
  { id: 52, name: '小鸡炖蘑菇', description: '东北经典鲜香入味', price: 45, image: 'https://images.unsplash.com/photo-1532550907401-a57141f2eefd?w=400', category: '炖菜' },
  { id: 53, name: '番茄炖牛腩', description: '酸甜浓郁牛肉软烂', price: 48, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400', category: '炖菜', isNew: true },
  { id: 54, name: '土豆炖牛肉', description: '土豆软糯牛肉鲜香', price: 46, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400', category: '炖菜' },
  { id: 55, name: '莲藕炖排骨', description: '莲藕粉糯排骨入味', price: 42, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '炖菜' },
  { id: 56, name: '萝卜炖羊肉', description: '冬日滋补暖心暖胃', price: 52, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '炖菜', isHot: true },
  { id: 57, name: '冬瓜炖鸭', description: '清淡解暑夏日首选', price: 40, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: '炖菜' },
  { id: 58, name: '黄豆炖猪蹄', description: '胶原蛋白美容养颜', price: 48, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '炖菜', isNew: true },
  { id: 59, name: '酸菜炖粉条', description: '东北风味酸爽开胃', price: 28, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '炖菜' },
  { id: 60, name: '红烧蹄髈', description: '酱香浓郁入口即化', price: 55, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '炖菜' },
  { id: 61, name: '咖喱炖鸡', description: '咖喱浓郁鸡肉鲜嫩', price: 38, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', category: '炖菜' },
  { id: 62, name: '海带炖排骨', description: '海带软糯排骨鲜香', price: 40, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: '炖菜', isHot: true },
  { id: 63, name: '腐竹炖肉', description: '腐竹吸满肉汁美味', price: 35, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '炖菜' },
  { id: 64, name: '白菜炖豆腐', description: '清淡鲜美家常味道', price: 22, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '炖菜', isNew: true },
  { id: 65, name: '红烧狮子头', description: '大口吃肉超满足', price: 42, image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400', category: '炖菜' },

  // ========== 凉菜 (15个) ==========
  { id: 66, name: '凉拌黄瓜', description: '清爽解腻开胃小菜', price: 12, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', category: '凉菜', isHot: true },
  { id: 67, name: '皮蛋豆腐', description: '嫩滑爽口夏日必备', price: 16, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '凉菜' },
  { id: 68, name: '凉拌木耳', description: '爽脆可口营养丰富', price: 15, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '凉菜', isNew: true },
  { id: 69, name: '拍黄瓜', description: '蒜香浓郁清爽解腻', price: 12, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', category: '凉菜' },
  { id: 70, name: '凉拌海带丝', description: '酸辣开胃低卡健康', price: 14, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '凉菜' },
  { id: 71, name: '口水鸡', description: '麻辣鲜香鸡肉嫩滑', price: 38, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', category: '凉菜', isHot: true },
  { id: 72, name: '蒜泥白肉', description: '蒜香浓郁肥而不腻', price: 35, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', category: '凉菜' },
  { id: 73, name: '凉拌鸡丝', description: '清爽开胃低脂健康', price: 28, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', category: '凉菜', isNew: true },
  { id: 74, name: '凉拌三丝', description: '三种蔬菜爽口搭配', price: 15, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '凉菜' },
  { id: 75, name: '老醋花生', description: '酸甜酥脆下酒神器', price: 16, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400', category: '凉菜', isHot: true },
  { id: 76, name: '凉拌腐竹', description: '软嫩爽口豆香四溢', price: 18, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '凉菜' },
  { id: 77, name: '凉拌藕片', description: '脆嫩爽口开胃解腻', price: 15, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '凉菜' },
  { id: 78, name: '凉拌莴笋', description: '清新脆嫩颜色翠绿', price: 14, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', category: '凉菜' },
  { id: 79, name: '卤味拼盘', description: '多种卤味一次满足', price: 42, image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400', category: '凉菜', isNew: true },
  { id: 80, name: '凉拌蕨根粉', description: 'Q弹爽滑酸辣开胃', price: 18, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400', category: '凉菜' },

  // ========== 沙拉 (20个) ==========
  { id: 81, name: '水果沙拉', description: '新鲜水果甜蜜缤纷', price: 25, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400', category: '沙拉', isHot: true },
  { id: 82, name: '蔬菜沙拉', description: '清爽健康低卡美味', price: 22, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '沙拉' },
  { id: 83, name: '鸡胸肉沙拉', description: '高蛋白健身首选', price: 32, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '沙拉', isNew: true },
  { id: 84, name: '凯撒沙拉', description: '经典口味浓郁芝士', price: 28, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category: '沙拉' },
  { id: 85, name: '金枪鱼沙拉', description: '深海蛋白健康美味', price: 35, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category: '沙拉' },
  { id: 86, name: '虾仁牛油果沙拉', description: '优质脂肪蛋白满满', price: 38, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '沙拉', isHot: true },
  { id: 87, name: '藜麦蔬菜沙拉', description: '超级食物营养均衡', price: 30, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '沙拉' },
  { id: 88, name: '三文鱼沙拉', description: '鲜美三文鱼健康搭配', price: 42, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: '沙拉', isNew: true },
  { id: 89, name: '希腊沙拉', description: '地中海风味清爽', price: 26, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', category: '沙拉' },
  { id: 90, name: '玉米沙拉', description: '香甜玉米清新可口', price: 20, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: '沙拉' },
  { id: 91, name: '土豆泥沙拉', description: '绵密口感奶香浓郁', price: 22, image: 'https://images.unsplash.com/photo-1574484284008-276d33848b66?w=400', category: '沙拉', isHot: true },
  { id: 92, name: '紫薯沙拉', description: '紫薯香甜颜值超高', price: 24, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400', category: '沙拉' },
  { id: 93, name: '鸡蛋沙拉', description: '蛋白满满营养均衡', price: 20, image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400', category: '沙拉' },
  { id: 94, name: '烤南瓜沙拉', description: '香甜软糯秋日限定', price: 26, image: 'https://images.unsplash.com/photo-1574484284008-276d33848b66?w=400', category: '沙拉', isNew: true },
  { id: 95, name: '芦笋沙拉', description: '清新爽口春天味道', price: 28, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '沙拉' },
  { id: 96, name: '豆腐沙拉', description: '嫩滑豆腐日式风味', price: 24, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '沙拉' },
  { id: 97, name: '牛肉沙拉', description: '鲜嫩牛肉高蛋白', price: 38, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400', category: '沙拉', isHot: true },
  { id: 98, name: '芒果虾仁沙拉', description: '热带风情鲜甜可口', price: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: '沙拉' },
  { id: 99, name: '彩虹沙拉', description: '七彩蔬菜颜值担当', price: 28, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '沙拉' },
  { id: 100, name: '全麦蔬菜卷', description: '粗粮纤维健康轻食', price: 25, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', category: '沙拉', isNew: true }
]

// 云函数入口函数
exports.main = async (event, context) => {
  const { type = 'goods' } = event
  
  try {
    // 初始化商品数据
    if (type === 'goods' || type === 'all') {
      // 先删除旧数据
      const oldGoods = await db.collection('goods').limit(1000).get()
      if (oldGoods.data.length > 0) {
        const deleteTasks = oldGoods.data.map(item => 
          db.collection('goods').doc(item._id).remove()
        )
        await Promise.all(deleteTasks)
      }
      
      // 添加 _openid 字段并写入新数据
      const goodsWithOpenId = goodsData.map(item => ({
        ...item,
        _openid: '' // 商品数据不绑定特定用户
      }))
      
      const batchSize = 100
      for (let i = 0; i < goodsWithOpenId.length; i += batchSize) {
        const batch = goodsWithOpenId.slice(i, i + batchSize)
        await db.collection('goods').add({
          data: batch
        })
      }
      
      return {
        success: true,
        message: `成功初始化 ${goodsData.length} 个商品`,
        count: goodsData.length
      }
    }
    
    // 清除收藏数据
    if (type === 'favorites' || type === 'all') {
      const oldFavorites = await db.collection('favorites').limit(1000).get()
      if (oldFavorites.data.length > 0) {
        const deleteTasks = oldFavorites.data.map(item => 
          db.collection('favorites').doc(item._id).remove()
        )
        await Promise.all(deleteTasks)
      }
      return {
        success: true,
        message: '收藏数据已清空',
        count: 0
      }
    }
    
    // 清除订单数据
    if (type === 'orders' || type === 'all') {
      const oldOrders = await db.collection('orders').limit(1000).get()
      if (oldOrders.data.length > 0) {
        const deleteTasks = oldOrders.data.map(item => 
          db.collection('orders').doc(item._id).remove()
        )
        await Promise.all(deleteTasks)
      }
      return {
        success: true,
        message: '订单数据已清空',
        count: 0
      }
    }
    
    return {
      success: true,
      message: '数据初始化完成'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message,
      error: err
    }
  }
}