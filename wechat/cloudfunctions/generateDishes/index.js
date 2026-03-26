const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const dishNames = {
  '肉菜': ['糖醋排骨','红烧肉','可乐鸡翅','宫保鸡丁','回锅肉','鱼香肉丝','东坡肉','蜜汁叉烧','蒜蓉粉丝虾','糖醋里脊','酱牛肉','京酱肉丝','孜然羊肉','口水鸡','蒜香骨','红烧狮子头','梅菜扣肉','黑椒牛柳','蒜香烤鸡','香酥鸭','咖喱牛腩','干锅牛蛙','香辣虾','麻辣香锅','干煸肥肠','爆炒猪肝','葱爆羊肉','椒盐排条','脆皮烧肉','白切鸡','盐水鸭','卤牛肉','夫妻肺片','蒜泥白肉','灯影牛肉'],
  '素菜': ['番茄炒蛋','麻婆豆腐','地三鲜','干煸四季豆','蚝油生菜','蒜蓉西兰花','红烧茄子','干锅花菜','香菇青菜','醋溜土豆丝','清炒荷兰豆','蒜蓉秋葵','干煸杏鲍菇','家常豆腐','炒时蔬','凉拌黄瓜','拍黄瓜','糖拌西红柿','凉拌木耳','凉拌海带丝','凉拌腐竹','凉拌藕片','凉拌莴笋','蒜泥茄子','虎皮青椒','炒南瓜','炒冬瓜','炒丝瓜','炒苦瓜','炒西葫芦','炒空心菜','炒油麦菜','炒茼蒿','炒韭菜','炒豆芽'],
  '汤菜': ['紫菜蛋花汤','番茄蛋汤','玉米排骨汤','冬瓜丸子汤','酸辣汤','鲫鱼豆腐汤','虫草花鸡汤','西湖牛肉羹','丝瓜蛋汤','海带排骨汤','萝卜牛腩汤','菌菇汤','菠菜猪肝汤','莲藕排骨汤','老火靓汤','花旗参乌鸡汤','猪肚鸡汤','椰子鸡汤','番茄牛尾汤','罗宋汤','奶油蘑菇汤','味噌汤','韩式大酱汤','冬阴功汤','肉骨茶','酸梅汤','绿豆汤','红豆汤','银耳莲子汤','冰糖雪梨汤','木瓜炖雪蛤','花胶鸡汤','鲍鱼鸡汤','海参汤','干贝汤'],
  '炖菜': ['东北乱炖','小鸡炖蘑菇','番茄炖牛腩','土豆炖牛肉','莲藕炖排骨','萝卜炖羊肉','冬瓜炖鸭','黄豆炖猪蹄','酸菜炖粉条','红烧蹄髈','咖喱炖鸡','海带炖排骨','腐竹炖肉','白菜炖豆腐','清炖羊肉','炖牛杂','炖羊杂','炖排骨','炖猪蹄','炖肘子','炖鸡腿','炖鸭腿','炖鹅','炖鹌鹑','炖鸽子','炖乌鸡','炖甲鱼','炖鳗鱼','炖黄鳝','炖泥鳅','炖豆腐','炖粉条','炖豆角','炖茄子','炖南瓜'],
  '凉菜': ['凉拌黄瓜','皮蛋豆腐','凉拌木耳','拍黄瓜','凉拌海带丝','口水鸡','蒜泥白肉','凉拌鸡丝','凉拌三丝','老醋花生','凉拌腐竹','凉拌藕片','凉拌莴笋','夫妻肺片','棒棒鸡','泡椒凤爪','卤鸡爪','卤鸭脖','卤鸭翅','卤鸭掌','卤鸡蛋','卤豆干','卤海带','卤藕片','卤笋','泡椒笋','泡椒木耳','泡椒海带','酸辣粉','凉皮','凉面','凉粉','冰粉','龟苓膏','双皮奶'],
  '沙拉': ['水果沙拉','蔬菜沙拉','鸡胸肉沙拉','凯撒沙拉','金枪鱼沙拉','虾仁牛油果沙拉','藜麦蔬菜沙拉','三文鱼沙拉','希腊沙拉','玉米沙拉','土豆泥沙拉','紫薯沙拉','鸡蛋沙拉','烤南瓜沙拉','芦笋沙拉','豆腐沙拉','牛肉沙拉','芒果虾仁沙拉','彩虹沙拉','全麦蔬菜卷','意面沙拉','藜麦沙拉','荞麦面沙拉','魔芋沙拉','海草沙拉','蟹柳沙拉','鱿鱼沙拉','章鱼沙拉','牛油果沙拉','火龙果沙拉','草莓沙拉','蓝莓沙拉','芒果沙拉','木瓜沙拉','哈密瓜沙拉']
}

const descs = ['鲜嫩可口，入口即化','香气扑鼻，回味无穷','口感丰富，层次分明','营养均衡，健康美味','经典传承，匠心制作','精选食材，新鲜现做','色香味俱全，食欲大开','软糯香甜，老少皆宜','清爽不腻，开胃下饭','浓郁醇厚，唇齿留香','外酥里嫩，金黄诱人','麻辣鲜香，过瘾解馋','清淡养生，原汁原味','酸甜适中，口感绝佳','鲜香四溢，美味难挡']
const imgs = ['https://images.unsplash.com/photo-1544025162-d76694265947?w=400','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400','https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400','https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400','https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400','https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=400','https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400']

const rand = arr => arr[Math.floor(Math.random() * arr.length)]
const price = cat => {
  const base = { '肉菜': 45, '素菜': 18, '汤菜': 28, '炖菜': 48, '凉菜': 22, '沙拉': 32 }
  return (base[cat] || 30) + Math.floor(Math.random() * 20) - 10
}

exports.main = async (event, context) => {
  try {
    const countRes = await db.collection('goods').count()
    if (countRes.total >= 200) return { code: 0, message: `已有 ${countRes.total} 个菜品`, data: null }
    
    const maxRes = await db.collection('goods').orderBy('id', 'desc').limit(1).get()
    let id = maxRes.data.length > 0 ? maxRes.data[0].id : 0
    
    const cats = ['肉菜','素菜','汤菜','炖菜','凉菜','沙拉']
    const dishes = []
    
    for (const cat of cats) {
      for (let i = 0; i < 35; i++) {
        id++
        dishes.push({
          id: id,
          name: dishNames[cat][i],
          description: rand(descs),
          price: price(cat),
          image: rand(imgs),
          category: cat,
          isHot: Math.random() > 0.85,
          isNew: Math.random() > 0.9
        })
      }
    }
    
    // 批量插入，每次100条
    const batchSize = 100
    for (let i = 0; i < dishes.length; i += batchSize) {
      const batch = dishes.slice(i, i + batchSize)
      const tasks = batch.map(d => db.collection('goods').add({ data: d }))
      await Promise.all(tasks)
    }
    
    return { code: 0, message: `成功生成 ${dishes.length} 个菜品`, data: { total: dishes.length } }
  } catch (err) {
    return { code: -1, message: err.message, data: null }
  }
}
