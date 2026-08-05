(() => {
  "use strict";

  const STUDENTS = {
    "婕荏": { plan:[["9-1",22],["9-3",12],["9-4",12],["mixed",4]], note:"9-1 集中回補；搭配 9-3、9-4" },
    "修聖": { plan:[["3-1",17],["3-2",17],["3-3",16]], note:"3-1、3-2、3-3 平均補強" },
    "瑀婕": { plan:[["7-5",15],["8-1",15],["8-2",15],["mixed",5]], note:"第 7 冊總複習銜接 8-1、8-2" },
    "詠議": { plan:[["4-5",15],["5-1",15],["5-2",15],["mixed",5]], note:"第 4 冊總複習銜接 5-1、5-2" },
    "吉祥": { plan:[["5-5",15],["6-1",15],["6-2",15],["mixed",5]], note:"第 5 冊總複習銜接 6-1、6-2" },
    "吉成": { plan:[["6-1",22],["6-4",12],["6-5",12],["mixed",4]], note:"6-1 集中回補；搭配 6-4 與總複習" },
    "薪恩": { plan:[["3-2",22],["3-4",12],["3-5",12],["mixed",4]], note:"3-2 集中回補；搭配 3-4 與總複習" }
  };

  const UNIT_META = {
    "3-1":"整數（三）", "3-2":"圖形（二）", "3-3":"用錢（二）", "3-4":"時間（二）", "3-5":"第 3 冊綜合練習",
    "4-5":"第 4 冊綜合練習", "5-1":"整數（五）・圖形（三）", "5-2":"分數（一）", "5-5":"第 5 冊綜合練習",
    "6-1":"整數（六）", "6-2":"統計圖表（二）・重量（二）", "6-4":"小數（一）", "6-5":"第 6 冊綜合練習",
    "7-5":"第 7 冊綜合練習", "8-1":"整數（八）・圖形（四）", "8-2":"分數（三）",
    "9-1":"整數（九）", "9-3":"圖形（五）・分數（四）", "9-4":"小數（三）", "mixed":"跨單元應用"
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = items => items[rand(0, items.length - 1)];
  const shuffle = items => {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const tidy = value => Number.isInteger(Number(value)) ? String(Number(value)) : String(Number(Number(value).toFixed(3)));
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fractionText = (numerator, denominator) => {
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
  };

  function optionPack(answer, distractors, suffix="") {
    const correct = `${answer}${suffix}`;
    const values = [answer, ...distractors].map(value => `${value}${suffix}`);
    const unique = [...new Set(values)];
    let step = 1;
    while (unique.length < 4) {
      const candidate = `${tidy(Number(answer) + step++)}${suffix}`;
      if (!unique.includes(candidate)) unique.push(candidate);
    }
    const options = shuffle(unique.slice(0, 4));
    return { options, answer:options.indexOf(correct) };
  }

  function textPack(answer, distractors) {
    const options = shuffle([...new Set([answer, ...distractors])].slice(0, 4));
    return { options, answer:options.indexOf(answer) };
  }

  function build(context, read, calc) {
    return {
      id:context.id, band:context.band, unit:context.unit, topic:UNIT_META[context.unit] || context.unit,
      dimension:context.dimension, difficulty:context.difficulty, trap:context.trap,
      stimulus:{ type:"text", title:context.title, text:context.text },
      stage1:{ prompt:read.prompt, options:read.pack.options, answer:read.pack.answer, hint:read.hint, explanation:read.explanation },
      stage2:{ prompt:calc.prompt, options:calc.pack.options, answer:calc.pack.answer, hint:calc.hint, explanation:calc.explanation },
      audit:calc.audit
    };
  }

  function integerQuestion(ctx, scale=100) {
    const original = rand(3, 8) * scale + rand(12, Math.max(15, scale - 1));
    const arrived = rand(1, 4) * Math.max(10, Math.floor(scale / 5)) + rand(3, 18);
    const left = rand(1, 3) * Math.max(10, Math.floor(scale / 6)) + rand(2, 15);
    const answer = original + arrived - left;
    const calc = optionPack(answer, [original + arrived, original - left, original + arrived + left], " 人");
    return build({...ctx, dimension:"步驟排序", difficulty:scale <= 100 ? "標準" : "挑戰", trap:"漏做第二步", title:"展覽入場", text:`展覽館原有 ${original} 人，上午又進場 ${arrived} 人，之後有 ${left} 人離場。現在館內有幾人？`},
      { prompt:"要算現在人數，哪個順序正確？", pack:textPack("原有人數＋進場人數－離場人數",["原有人數－進場人數＋離場人數","三個數字全部相加","只算進場和離場的差"]), hint:"進場會增加，離場會減少。", explanation:"應依事件順序，先加進場人數，再扣除離場人數。" },
      { prompt:"現在館內有幾人？", pack:calc, hint:`先算 ${original}＋${arrived}，還要處理離場的 ${left} 人。`, explanation:`${original}＋${arrived}－${left}＝${answer}（人）。`, audit:{ op:"addSub", values:[original,arrived,left], result:answer } });
  }

  function moneyQuestion(ctx, maxPaid=500) {
    const priceA = rand(3, Math.max(4, Math.floor(maxPaid / 45))) * 10 + rand(0, 4) * 5;
    const priceB = rand(2, Math.max(3, Math.floor(maxPaid / 60))) * 10 + rand(0, 2) * 5;
    const total = priceA + priceB;
    const paid = Math.max(100, Math.ceil((total + 10) / 100) * 100);
    const answer = paid - total;
    const calc = optionPack(answer, [total, paid - priceA, paid + total], " 元");
    return build({...ctx, dimension:"問句定位", difficulty:"標準", trap:"把總價當找回", title:"文具店結帳", text:`小晴買了 ${priceA} 元的筆記本和 ${priceB} 元的色紙，付 ${paid} 元。店員應找回多少元？`},
      { prompt:"題目最後要找哪一個量？", pack:textPack("店員找回的錢",["兩件商品的總價","小晴付出的錢","其中一件商品的價格"]), hint:"只看最後一句的「找回」。", explanation:"問句要找的是找回金額；總價只是解題過程中的中間量。" },
      { prompt:"店員應找回多少元？", pack:calc, hint:"先算兩件商品總價，再用付款金額扣掉。", explanation:`商品共 ${priceA}＋${priceB}＝${total} 元；${paid}－${total}＝${answer} 元。`, audit:{ op:"sub2", values:[paid,priceA,priceB], result:answer } });
  }

  function timeQuestion(ctx) {
    const hour = rand(8, 15), minute = pick([0,5,10,15,20,25,30,35,40,45,50]);
    const first = pick([20,25,30,35,40,45,50]), rest = pick([10,15,20]), second = pick([15,20,25,30,35]);
    const start = hour * 60 + minute, end = start + first + rest + second;
    const timeText = value => `${Math.floor(value / 60)}:${String(value % 60).padStart(2,"0")}`;
    const answer = timeText(end);
    const calc = textPack(answer,[timeText(end - rest),timeText(end + 10),timeText(end - 15),timeText(end + 15)]);
    return build({...ctx, dimension:"單位與表徵", difficulty:"標準", trap:"漏掉休息時間", title:"閱讀活動", text:`閱讀活動 ${timeText(start)} 開始，導讀 ${first} 分鐘，休息 ${rest} 分鐘，再分組閱讀 ${second} 分鐘。活動幾點結束？`},
      { prompt:"求結束時間時，哪些時間都要計入？", pack:textPack("導讀、休息和分組閱讀",["只算導讀和分組閱讀","只算休息時間","把開始時刻當經過時間"]), hint:"休息仍然會經過時間。", explanation:"從開始到結束，導讀、休息和分組閱讀三段都要計入。" },
      { prompt:"活動幾點結束？", pack:calc, hint:`總共經過 ${first}＋${rest}＋${second} 分鐘。`, explanation:`共經過 ${first + rest + second} 分鐘，${timeText(start)} 往後推是 ${answer}。`, audit:{ op:"timeAdd", values:[start,first,rest,second], result:end } });
  }

  function geometryQuestion(ctx, large=false) {
    const length = rand(large ? 18 : 6, large ? 45 : 16);
    const width = rand(large ? 10 : 4, Math.max(large ? 16 : 6, length - 2));
    const gate = rand(2, Math.min(6, width));
    const answer = 2 * (length + width) - gate;
    const calc = optionPack(answer,[length * width,2 * (length + width),length + width - gate]," 公尺");
    return build({...ctx, dimension:"條件篩選", difficulty:large ? "挑戰" : "標準", trap:"忘記扣除入口", title:"花圃圍籬", text:`長方形花圃長 ${length} 公尺、寬 ${width} 公尺。四周要圍圍籬，但保留 ${gate} 公尺寬的入口不圍。需要多少公尺圍籬？`},
      { prompt:"哪一項條件會讓圍籬短於完整周長？", pack:textPack(`保留 ${gate} 公尺入口`,["花圃是長方形",`長是 ${length} 公尺`,`寬是 ${width} 公尺`]), hint:"找出哪一段明確說「不圍」。", explanation:"完整周長算完後，還要扣除保留入口的長度。" },
      { prompt:"需要多少公尺圍籬？", pack:calc, hint:"先算完整周長，再扣入口。", explanation:`（${length}＋${width}）×2－${gate}＝${answer}（公尺）。`, audit:{ op:"perimeterGap", values:[length,width,gate], result:answer } });
  }

  function fractionQuestion(ctx, advanced=false) {
    const denominator = pick(advanced ? [6,8,10,12] : [4,5,6,8]);
    const usedA = rand(1, Math.max(1, Math.floor(denominator / 3)));
    const usedB = rand(1, Math.max(1, denominator - usedA - 1));
    const remain = denominator - usedA - usedB;
    const answer = fractionText(remain, denominator);
    const raw = `${remain}/${denominator}`;
    const candidates = [usedA + usedB,usedA,usedB,Math.max(1,remain-1),Math.min(denominator-1,remain+1)]
      .map(value => fractionText(value,denominator)).concat(["0","1"])
      .filter(value => value !== answer);
    const pack = textPack(answer,[...new Set(candidates)].slice(0,3));
    return build({...ctx, dimension:"關係辨認", difficulty:advanced ? "挑戰" : "標準", trap:"把用掉當剩下", title:"果汁分享", text:`一壺果汁看成 1 壺。午餐喝了 ${usedA}/${denominator} 壺，點心時間又喝了 ${usedB}/${denominator} 壺。還剩幾分之幾壺？`},
      { prompt:"題目問「還剩」，應怎麼表示？", pack:textPack("全部－午餐喝掉－點心喝掉",["午餐喝掉＋點心喝掉","全部＋兩次喝掉","只看第二次喝掉"]), hint:"剩下要從完整的一壺扣除兩次喝掉的量。", explanation:"題目問剩餘量，不是兩次一共喝掉多少。" },
      { prompt:"還剩幾分之幾壺？", pack, hint:`把 1 寫成 ${denominator}/${denominator}。`, explanation:`${denominator}/${denominator}－${usedA}/${denominator}－${usedB}/${denominator}＝${raw}${raw === answer ? "" : `＝${answer}`}。`, audit:{ op:"fractionRemain", values:[denominator,usedA,usedB], result:answer } });
  }

  function weightQuestion(ctx) {
    const weights = [rand(18,35),rand(25,48),rand(30,55),rand(20,45)];
    const total = weights.reduce((sum,value)=>sum+value,0);
    const max = Math.max(...weights), min = Math.min(...weights), answer = max - min;
    const pack = optionPack(answer,[total,max,min]," 公斤");
    return build({...ctx, dimension:"條件篩選", difficulty:"標準", trap:"把合計當相差", title:"回收物重量紀錄", text:`四組回收物重量依序是 ${weights.join("、")} 公斤。最重的一組比最輕的一組多幾公斤？`},
      { prompt:"回答「多幾公斤」需要使用哪些資料？", pack:textPack("最大值和最小值",["四組全部相加","只看第一組和最後一組","最大值和總重量"]), hint:"多幾是在比較差距。", explanation:"應先找最重與最輕，再求兩者的差。" },
      { prompt:"最重的一組比最輕的一組多幾公斤？", pack, hint:`找出 ${weights.join("、")} 中最大與最小的數。`, explanation:`最重 ${max} 公斤，最輕 ${min} 公斤，相差 ${max}－${min}＝${answer} 公斤。`, audit:{ op:"maxMin", values:weights, result:answer } });
  }

  function decimalQuestion(ctx, digits=1) {
    const unit = 10 ** digits;
    const aN = rand(12 * unit, 38 * unit), bN = rand(5 * unit, 17 * unit);
    const usedN = rand(2 * unit, Math.min(8 * unit, aN + bN - unit));
    const a = aN / unit, b = bN / unit, used = usedN / unit, answer = (aN + bN - usedN) / unit;
    const pack = optionPack(tidy(answer),[tidy(a+b),tidy(a-used),tidy(a+b+used)]," 公尺");
    return build({...ctx, dimension:"步驟排序", difficulty:digits === 1 ? "標準" : "挑戰", trap:"小數步驟或位值錯誤", title:"布條製作", text:`有兩段布條，分別長 ${tidy(a)} 公尺和 ${tidy(b)} 公尺。接起來後用掉 ${tidy(used)} 公尺，還剩多少公尺？`},
      { prompt:"正確的解題順序是哪一個？", pack:textPack("先把兩段相加，再扣掉用掉的長度",["先把兩段相減，再加用掉的長度","三個數字全部相加","只用第一段扣掉用掉的長度"]), hint:"先接起來，總長會增加；後來用掉才減少。", explanation:"事件順序是先合併兩段，再扣除使用量。" },
      { prompt:"還剩多少公尺？", pack, hint:"小數點要對齊，先加後減。", explanation:`${tidy(a)}＋${tidy(b)}－${tidy(used)}＝${tidy(answer)}（公尺）。`, audit:{ op:"addSubDecimal", values:[a,b,used], result:answer } });
  }

  function capacityQuestion(ctx, scale=1) {
    const capacity = rand(4,8) * scale;
    const people = capacity * rand(4,8) + rand(1,capacity-1);
    const vehicles = Math.ceil(people / capacity), empty = vehicles * capacity - people;
    const pack = optionPack(empty,[vehicles,people % capacity,capacity]," 個");
    return build({...ctx, dimension:"限制判斷", difficulty:"挑戰", trap:"有餘數卻未增加一組", title:"校外教學座位", text:`有 ${people} 人參加校外教學，每輛車最多坐 ${capacity} 人。車輛都坐滿或安排完最後一車後，至少需要幾輛車？最後一車會有幾個空位？`},
      { prompt:"人數除以每車座位數有餘數時，車輛數要怎麼處理？", pack:textPack("商再加 1 輛",["只取商，不管餘數","用餘數當車輛數","把商和餘數相乘"]), hint:"剩下的人也必須有車坐。", explanation:"只要仍有人未安排，就必須再增加一輛車。" },
      { prompt:"最後一車會有幾個空位？", pack, hint:`先求至少需要 ${vehicles} 輛，再比較總座位和人數。`, explanation:`至少 ${vehicles} 輛，共 ${vehicles*capacity} 個座位；${vehicles*capacity}－${people}＝${empty} 個空位。`, audit:{ op:"capacityGap", values:[people,capacity], result:empty } });
  }

  function largeIntegerQuestion(ctx, scale=10000) {
    const base = rand(12,80) * scale + rand(100,9999);
    const increase = rand(2,9) * Math.floor(scale/2) + rand(10,999);
    const decrease = rand(1,6) * Math.floor(scale/3) + rand(10,699);
    const answer = base + increase - decrease;
    const pack = optionPack(answer,[base+increase,base-decrease,base+increase+decrease]," 件");
    return build({...ctx, dimension:"步驟排序", difficulty:"挑戰", trap:"多位數進退位或漏步驟", title:"物資倉庫", text:`倉庫原有 ${base.toLocaleString("zh-TW")} 件物資，新到貨 ${increase.toLocaleString("zh-TW")} 件，之後運出 ${decrease.toLocaleString("zh-TW")} 件。現在有多少件？`},
      { prompt:"哪個算式符合物資的變化？", pack:textPack("原有＋到貨－運出",["原有－到貨＋運出","原有＋到貨＋運出","只算到貨－運出"]), hint:"到貨增加，運出減少。", explanation:"先加新到貨，再扣掉運出的物資。" },
      { prompt:"現在有多少件物資？", pack, hint:"多位數直式要對齊個位。", explanation:`${base.toLocaleString("zh-TW")}＋${increase.toLocaleString("zh-TW")}－${decrease.toLocaleString("zh-TW")}＝${answer.toLocaleString("zh-TW")}（件）。`, audit:{ op:"addSub", values:[base,increase,decrease], result:answer } });
  }

  function factoryFor(unit, index) {
    if (unit === "3-1") return ctx => integerQuestion(ctx, 100);
    if (unit === "3-2") return ctx => geometryQuestion(ctx, false);
    if (unit === "3-3") return ctx => moneyQuestion(ctx, 300);
    if (unit === "3-4") return timeQuestion;
    if (unit === "5-1") return index % 2 ? (ctx => integerQuestion(ctx,1000)) : (ctx => geometryQuestion(ctx,true));
    if (unit === "5-2") return ctx => fractionQuestion(ctx,false);
    if (unit === "6-1") return ctx => integerQuestion(ctx,1000);
    if (unit === "6-2") return weightQuestion;
    if (unit === "6-4") return ctx => decimalQuestion(ctx,1);
    if (unit === "8-1") return index % 2 ? (ctx => largeIntegerQuestion(ctx,10000)) : (ctx => geometryQuestion(ctx,true));
    if (unit === "8-2") return ctx => fractionQuestion(ctx,true);
    if (unit === "9-1") return ctx => largeIntegerQuestion(ctx,100000);
    if (unit === "9-3") return index % 2 ? (ctx => fractionQuestion(ctx,true)) : (ctx => geometryQuestion(ctx,true));
    if (unit === "9-4") return ctx => decimalQuestion(ctx, index % 2 ? 2 : 3);
    const book = Number(String(unit).match(/^\d+/)?.[0] || 6);
    const lower = book <= 4 ? [ctx => integerQuestion(ctx,100),ctx => moneyQuestion(ctx,300),timeQuestion,ctx => geometryQuestion(ctx,false)]
      : book <= 6 ? [ctx => integerQuestion(ctx,1000),ctx => geometryQuestion(ctx,true),ctx => fractionQuestion(ctx,false),weightQuestion,ctx => decimalQuestion(ctx,1)]
      : book <= 8 ? [ctx => largeIntegerQuestion(ctx,10000),ctx => fractionQuestion(ctx,true),ctx => geometryQuestion(ctx,true),capacityQuestion]
      : [ctx => largeIntegerQuestion(ctx,100000),ctx => fractionQuestion(ctx,true),ctx => decimalQuestion(ctx,2),ctx => geometryQuestion(ctx,true)];
    return lower[index % lower.length];
  }

  function bookOf(unit) {
    return Number(String(unit).match(/^\d+/)?.[0] || 6);
  }

  function generate(student, count=12) {
    const config = STUDENTS[student];
    if (!config) return [];
    const guaranteed = config.plan.map(([unit]) => unit);
    const weighted = config.plan.flatMap(([unit, weight]) => Array(weight).fill(unit));
    const units = shuffle(guaranteed.concat(shuffle(weighted).slice(0, Math.max(0, count - guaranteed.length)))).slice(0, count);
    return units.map((unit,index) => {
      const actualUnit = unit === "mixed"
        ? pick(config.plan.map(([candidate]) => candidate).filter(candidate => candidate !== "mixed"))
        : unit;
      const book = bookOf(actualUnit);
      const ctx = {
        id:`RT-${student}-${actualUnit}-${Date.now().toString(36)}-${index+1}`,
        unit:actualUnit, band:book >= 7 ? "upper" : "middle"
      };
      return factoryFor(actualUnit,index)(ctx);
    });
  }

  window.READING_RETEST = { students:STUDENTS, unitMeta:UNIT_META, generate };
})();
