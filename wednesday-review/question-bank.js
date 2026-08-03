(() => {
  "use strict";

  const STUDENTS = {
    "婕荏": { plan:[ ["9-1",22], ["9-3",12], ["9-4",12], ["mixed",4] ], note:"9-1 未通過，集中回補" },
    "修聖": { plan:[ ["3-1",17], ["3-2",17], ["3-3",16] ], note:"三個單元平均補強" },
    "瑀婕": { plan:[ ["7-5",15], ["8-1",15], ["8-2",15], ["mixed",5] ], note:"新進度題組" },
    "詠議": { plan:[ ["4-5",15], ["5-1",15], ["5-2",15], ["mixed",5] ], note:"新進度題組" },
    "吉祥": { plan:[ ["5-5",15], ["6-1",15], ["6-2",15], ["mixed",5] ], note:"新進度題組" },
    "吉成": { plan:[ ["6-1",22], ["6-4",12], ["6-5",12], ["mixed",4] ], note:"6-1 未通過，集中回補" },
    "薪恩": { plan:[ ["3-2",22], ["3-4",12], ["3-5",12], ["mixed",4] ], note:"3-2 未通過，集中回補" }
  };

  const UNIT_META = {
    "3-2": { topic:"圖形（二）", status:"verified" },
    "3-3": { topic:"用錢（二）", status:"verified" },
    "3-4": { topic:"時間（二）", status:"verified" },
    "5-2": { topic:"分數（一）", status:"verified" },
    "6-1": { topic:"整數（六）安全範圍", status:"provisional" },
    "6-2": { topic:"統計圖表（二）・重量（二）", status:"verified" },
    "6-4": { topic:"小數（一）", status:"verified" },
    "8-2": { topic:"分數（三）", status:"verified" },
    "9-3": { topic:"圖形（五）・分數（四）", status:"verified" },
    "9-4": { topic:"小數（三）", status:"verified" }
  };

  const unique = values => [...new Set(values.map(value => String(value)))];
  function numericOptions(answer, distractors, suffix="") {
    const options = unique([answer, ...distractors]).slice(0, 4);
    let step = Math.max(1, Math.round(Math.abs(Number(answer) || 1) / 10));
    while (options.length < 4) {
      const candidate=String(Number(answer)+step++);
      if(!options.includes(candidate))options.push(candidate);
    }
    return options.map(value => `${value}${suffix}`);
  }
  function q(base) {
    return Object.assign({
      questionType:"basic", difficulty:1, prerequisite:"", errorCode:"unknown",
      explanation:"", status:"verified"
    }, base);
  }

  function moneyQuestions(student, count, offset=0) {
    const out = [];
    for (let localIndex=0; localIndex<count; localIndex++) {
      const i = localIndex + offset;
      const mode = i % 8;
      const a = 20 + (i % 6) * 10;
      const b = 15 + (i % 5) * 5;
      const c = 8 + (i % 4) * 3;
      const id = `${student}-3-3-${String(i+1).padStart(3,"0")}`;
      if (mode === 0) {
        const total = 100 * (1 + i % 3) + 10 * (2 + i % 5) + (i % 4) * 5;
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"合成總金額",questionType:"concept",difficulty:1,
          stem:`${1+i%3} 張 100 元、${2+i%5} 枚 10 元和 ${i%4} 枚 5 元，合起來是多少元？`,
          options:numericOptions(total,[total-10,total+10,100*(1+i%3)+2+i%5]),answer:`${total}`,
          explanation:`先算百元、十元和五元，再合起來：${100*(1+i%3)}＋${10*(2+i%5)}＋${5*(i%4)}＝${total} 元。`,
          errorCode:"money_value_count",prerequisite:"認識錢幣與幣值",variantGroup:"money-compose" }));
      } else if (mode === 1) {
        const total=a+b;
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"兩件商品合計",questionType:"application",difficulty:1,
          stem:`一盒彩筆 ${a} 元，一本筆記本 ${b} 元，兩樣合計多少元？`,options:numericOptions(total,[a-b,a+b+10,a]),answer:`${total}`,
          explanation:`合計要用加法：${a}＋${b}＝${total} 元。`,errorCode:"money_total_vs_difference",prerequisite:"兩位數加法",variantGroup:"money-two-items" }));
      } else if (mode === 2) {
        const price=a+b, paid=price+(i%2?5:20), enough="夠，還會剩下錢";
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"判斷錢夠不夠",questionType:"application",difficulty:1,
          stem:`商品共 ${price} 元，小安帶了 ${paid} 元。他的錢夠嗎？`,options:[enough,"不夠，還差錢","剛好，一元不剩","資料不足"],answer:enough,
          explanation:`${paid} 元比 ${price} 元多，所以錢夠，還會有剩餘。`,errorCode:"money_enough_compare",prerequisite:"金額大小比較",variantGroup:"money-enough" }));
      } else if (mode === 3) {
        const price=35+(i%6)*10, paid=100, change=paid-price;
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"找回金額",questionType:"application",difficulty:2,
          stem:`買一個 ${price} 元的文具，用 100 元付款，應找回多少元？`,options:numericOptions(change,[price,paid+price,change+10]),answer:`${change}`,
          explanation:`找回的錢＝付的錢－價格：100－${price}＝${change} 元。`,errorCode:"money_change_direction",prerequisite:"兩位數減法",variantGroup:"money-change" }));
      } else if (mode === 4) {
        const target=100+20*(i%4)+10;
        const correct=`1 張 100 元和 ${(target-100)/10} 枚 10 元`;
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"同額不同付法",questionType:"concept",difficulty:2,
          stem:`下面哪一種付法剛好是 ${target} 元？`,options:[correct,`${target/10-1} 枚 10 元`,`1 張 100 元和 ${target-100} 枚 10 元`,`${target} 枚 1 元和 1 枚 10 元`],answer:correct,
          explanation:`100＋${target-100}＝${target}，而每枚 10 元需要 ${(target-100)/10} 枚。`,errorCode:"money_coin_number",prerequisite:"十個一與一個十",variantGroup:"money-equivalent" }));
      } else if (mode === 5) {
        const x=60+(i%4)*15,y=45+(i%3)*20,answer=x>y?"甲比較貴":x<y?"乙比較貴":"一樣貴";
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"比較金額",questionType:"concept",difficulty:1,
          stem:`甲商品 ${x} 元，乙商品 ${y} 元。哪一個比較貴？`,options:["甲比較貴","乙比較貴","一樣貴","無法比較"],answer,
          explanation:`比較 ${x} 和 ${y} 的大小即可。`,errorCode:"money_compare",prerequisite:"三位數以內大小比較",variantGroup:"money-compare" }));
      } else if (mode === 6) {
        const total=a+b+c;
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"看價目表解題",questionType:"application",difficulty:2,
          stem:`價目表：牛奶 ${a} 元、麵包 ${b} 元、茶葉蛋 ${c} 元。三樣各買一份，共多少元？`,options:numericOptions(total,[a+b,total-c,total+10]),answer:`${total}`,
          explanation:`三樣都買要全部相加：${a}＋${b}＋${c}＝${total} 元。`,errorCode:"money_table_missing_item",prerequisite:"連加",variantGroup:"money-price-list" }));
      } else {
        const price=70+(i%3)*10,paid=100,wrong=price+paid,answer="把付的錢和價格相加了";
        out.push(q({ id,student,book:3,unit:"3-3",topic:"用錢（二）",skill:"找錯訂正",questionType:"error",difficulty:2,
          stem:`小文買 ${price} 元的玩具，付 100 元。他算 100＋${price}＝${wrong} 元當作找回的錢。錯在哪裡？`,
          options:[answer,"把元寫成角了","商品數量看錯了","沒有錯"],answer,
          explanation:`找回金額應是付的錢減掉商品價格，不是相加。`,errorCode:"money_change_add",prerequisite:"理解找回多少",variantGroup:"money-find-error" }));
      }
    }
    return out;
  }

  function timeText(totalMinutes) {
    const h = Math.floor(totalMinutes / 60) % 24, m = totalMinutes % 60;
    return `${h}:${String(m).padStart(2,"0")}`;
  }
  function clockOptions(answer, candidates, baseMinutes) {
    const options = unique([answer, ...candidates]);
    let bump = 5;
    while (options.length < 4) {
      const candidate = timeText(baseMinutes + bump);
      if (!options.includes(candidate)) options.push(candidate);
      bump += 5;
    }
    return options.slice(0, 4);
  }
  function timeQuestions(student, count, offset=0) {
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset;
      const mode=i%6,id=`${student}-3-4-${String(i+1).padStart(3,"0")}`;
      const start=8*60+(i%6)*10, duration=20+(i%5)*10, end=start+duration;
      if(mode===0){
        const answer=`${duration} 分鐘`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"經過幾分鐘",questionType:"basic",difficulty:1,
          stem:`活動從 ${timeText(start)} 開始，到 ${timeText(end)} 結束，共經過多久？`,options:[answer,`${duration+10} 分鐘`,`${Math.max(5,duration-10)} 分鐘`,`${duration} 小時`],answer,
          explanation:`從 ${timeText(start)} 往後數到 ${timeText(end)}，共 ${duration} 分鐘。`,errorCode:"elapsed_time",prerequisite:"5 分鐘刻度",variantGroup:"time-elapsed"}));
      }else if(mode===1){
        const answer=timeText(end);
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"求結束時間",questionType:"application",difficulty:2,
          stem:`小美 ${timeText(start)} 開始閱讀，讀了 ${duration} 分鐘，幾點結束？`,options:clockOptions(answer,[timeText(end+10),timeText(start-duration),timeText(start+duration+60)],end),answer,
          explanation:`開始時間往後加 ${duration} 分鐘，得到 ${answer}。`,errorCode:"time_end_forward",prerequisite:"時間往後推",variantGroup:"time-end"}));
      }else if(mode===2){
        const answer=timeText(start);
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"反推開始時間",questionType:"application",difficulty:2,
          stem:`一堂活動在 ${timeText(end)} 結束，共進行 ${duration} 分鐘。活動幾點開始？`,options:clockOptions(answer,[timeText(end+duration),timeText(start-10),timeText(end-duration+60)],start),answer,
          explanation:`已知結束時間，要往前退 ${duration} 分鐘，得到 ${answer}。`,errorCode:"time_start_backward",prerequisite:"時間往前推",variantGroup:"time-start"}));
      }else if(mode===3){
        const a=timeText(start),b=timeText(start+25),answer=`${a} 比較早`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"判斷先後",questionType:"concept",difficulty:1,
          stem:`甲事情在 ${a} 發生，乙事情在 ${b} 發生。哪一個比較早？`,options:[answer,`${b} 比較早`,"同時發生","無法判斷"],answer,
          explanation:`同一天中，時刻較小的 ${a} 先發生。`,errorCode:"time_sequence",prerequisite:"讀數字時間",variantGroup:"time-order"}));
      }else if(mode===4){
        const minutes=(i%10)*5,answer=`${minutes} 分`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"分針與刻度",questionType:"concept",difficulty:1,
          stem:`分針從 12 走到鐘面上的 ${minutes/5 || 12}，代表走了幾分鐘？`,options:[answer,`${minutes/5 || 12} 分`,`${minutes+5} 分`,`60 分`],answer,
          explanation:`鐘面每一大格是 5 分鐘，所以用走過的大格數乘以 5。`,errorCode:"clock_hand_scale",prerequisite:"5 的倍數",variantGroup:"clock-minute"}));
      }else{
        const answer="把分鐘當成十進位，沒有用 60 分鐘進一小時";
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（二）",skill:"找錯訂正",questionType:"error",difficulty:2,
          stem:"小安說：8:50 再過 20 分鐘是 8:70。錯誤原因是什麼？",options:[answer,"時針與分針看反","應該用減法","沒有錯"],answer,
          explanation:"60 分鐘要換成 1 小時，所以 8:50 再過 20 分鐘是 9:10。",errorCode:"time_base60",prerequisite:"60 分鐘＝1 小時",variantGroup:"time-error"}));
      }
    }
    return out;
  }

  function integerQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset;
      const mode=i%8,id=`${student}-6-1-${String(i+1).padStart(3,"0")}`;
      const a=1250+(i*137)%7000,b=320+(i*83)%1800;
      const common={id,student,book:6,unit:"6-1",topic:"整數（六）安全範圍",status:"provisional"};
      if(mode===0){const answer=`${Math.floor(a/100)%10}`;out.push(q({...common,skill:"整數位值",questionType:"concept",difficulty:1,stem:`整數 ${a} 的百位數字是多少？`,options:unique([answer,`${a%10}`,`${Math.floor(a/10)%10}`,`${Math.floor(a/1000)%10}`]),answer,explanation:"從右邊起依序是個位、十位、百位、千位。",errorCode:"integer_place_value",prerequisite:"位值",variantGroup:"integer-place"}));}
      else if(mode===1){const answer=a>b?`${a}`:`${b}`;out.push(q({...common,skill:"大小比較",questionType:"concept",difficulty:1,stem:`下面兩個整數哪一個比較大？`,options:unique([`${a}`,`${b}`,`${Math.abs(a-b)}`,`${a+b}`]),answer,explanation:"先比較位數，再從最高位開始比較。",errorCode:"integer_compare",prerequisite:"位值",variantGroup:"integer-compare"}));}
      else if(mode===2){const ans=a+b;out.push(q({...common,skill:"整數加法",questionType:"basic",difficulty:1,stem:`${a}＋${b}＝？`,options:numericOptions(ans,[a-b,ans+100,ans-10]),answer:`${ans}`,explanation:`相同位值對齊後相加，答案是 ${ans}。`,errorCode:"integer_add_carry",prerequisite:"進位加法",variantGroup:"integer-add"}));}
      else if(mode===3){const ans=a-b;out.push(q({...common,skill:"整數減法",questionType:"basic",difficulty:1,stem:`${a}－${b}＝？`,options:numericOptions(ans,[a+b,ans+100,ans-10]),answer:`${ans}`,explanation:`相同位值對齊後相減，答案是 ${ans}。`,errorCode:"integer_sub_borrow",prerequisite:"退位減法",variantGroup:"integer-sub"}));}
      else if(mode===4){const factor=3+i%7,base=24+i%20,ans=base*factor;out.push(q({...common,skill:"整數乘法",questionType:"basic",difficulty:2,stem:`${base}×${factor}＝？`,options:numericOptions(ans,[base+factor,ans-factor,ans+10]),answer:`${ans}`,explanation:`${base} 個 ${factor}（或 ${factor} 個 ${base}）合起來是 ${ans}。`,errorCode:"integer_multiply",prerequisite:"乘法表",variantGroup:"integer-mul"}));}
      else if(mode===5){const divisor=3+i%6,quotient=12+i%18,total=divisor*quotient,answer=`${quotient}`;out.push(q({...common,skill:"整數除法",questionType:"basic",difficulty:2,stem:`${total}÷${divisor}＝？`,options:numericOptions(quotient,[divisor,total-divisor,quotient+2]),answer,explanation:`因為 ${divisor}×${quotient}＝${total}，所以商是 ${quotient}。`,errorCode:"integer_divide",prerequisite:"乘除互逆",variantGroup:"integer-div"}));}
      else if(mode===6){const people=31+i%20,size=4+i%4,groups=Math.ceil(people/size),answer=`${groups} 組`;out.push(q({...common,skill:"餘數情境",questionType:"application",difficulty:2,stem:`${people} 人分組，每組最多 ${size} 人，至少需要幾組？`,options:[answer,`${Math.floor(people/size)} 組`,`${people-size} 組`,`${groups+1} 組`],answer,explanation:`${people}÷${size} 有剩下的人，剩下的人仍需一組，所以要 ${groups} 組。`,errorCode:"remainder_context",prerequisite:"有餘數除法",variantGroup:"integer-remainder"}));}
      else{const estimate=Math.round((a+b)/100)*100,answer=`約 ${estimate}`;out.push(q({...common,skill:"估算與驗證",questionType:"error",difficulty:2,stem:`估一估，${a}＋${b} 最接近哪一個答案？`,options:[answer,`約 ${estimate+1000}`,`約 ${Math.max(0,estimate-1000)}`,`約 ${a}`],answer,explanation:"先把數取到接近的整百，再相加檢查答案範圍。",errorCode:"integer_estimate",prerequisite:"整百數",variantGroup:"integer-estimate"}));}
    }
    return out;
  }

  function decimalQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset;
      const mode=i%6,id=`${student}-6-4-${String(i+1).padStart(3,"0")}`;
      const whole=i%5,tenths=1+i%8,value=`${whole}.${tenths}`;
      const common={id,student,book:6,unit:"6-4",topic:"小數（一）",status:"verified"};
      if(mode===0){const answer=`${tenths}/10`;out.push(q({...common,skill:"分數與小數互換",questionType:"concept",difficulty:1,stem:`小數 0.${tenths} 表示下面哪一個分數？`,options:[answer,`${tenths}/100`,`10/${tenths}`,`${tenths}/1`],answer,explanation:`0.${tenths} 是 ${tenths} 個十分之一，也就是 ${tenths}/10。`,errorCode:"decimal_fraction",prerequisite:"十分之一",variantGroup:"decimal-fraction"}));}
      else if(mode===1){const answer=`${tenths}`;out.push(q({...common,skill:"十分位位值",questionType:"concept",difficulty:1,stem:`${value} 的十分位數字是多少？`,options:unique([answer,`${whole}`,`${whole*10+tenths}`,"0"]),answer,explanation:"小數點右邊第一位是十分位。",errorCode:"decimal_place_value",prerequisite:"個位與十分位",variantGroup:"decimal-place"}));}
      else if(mode===2){const other=`${whole}.${Math.max(0,tenths-1)}`,answer=value;out.push(q({...common,skill:"一位小數大小比較",questionType:"concept",difficulty:1,stem:`下面哪一個數比較大？`,options:unique([value,other,`${Math.max(0,whole-1)}.${tenths}`,`${whole}.0`]),answer,explanation:"整數部分相同時，再比較十分位。",errorCode:"decimal_compare",prerequisite:"位值比較",variantGroup:"decimal-compare"}));}
      else if(mode===3){const x=1+(i%5)/10,y=0.2+(i%4)/10,ans=(x+y).toFixed(1);out.push(q({...common,skill:"一位小數加法",questionType:"basic",difficulty:2,stem:`${x.toFixed(1)}＋${y.toFixed(1)}＝？`,options:unique([ans,(x+y+1).toFixed(1),(x+y-.1).toFixed(1),`${Math.round(x*10+y*10)}`]),answer:ans,explanation:"個位對個位、十分位對十分位相加，小數點要對齊。",errorCode:"decimal_align_add",prerequisite:"十分位",variantGroup:"decimal-add"}));}
      else if(mode===4){const x=4+(i%5)/10,y=1+(i%4)/10,ans=(x-y).toFixed(1);out.push(q({...common,skill:"一位小數減法",questionType:"basic",difficulty:2,stem:`${x.toFixed(1)}－${y.toFixed(1)}＝？`,options:unique([ans,(x-y+1).toFixed(1),(x-y-.1).toFixed(1),`${Math.round(x*10-y*10)}`]),answer:ans,explanation:"小數點對齊後，從十分位開始相減。",errorCode:"decimal_align_sub",prerequisite:"一位小數減法",variantGroup:"decimal-sub"}));}
      else{const answer="小數點沒有對齊相同位值";out.push(q({...common,skill:"找錯訂正",questionType:"error",difficulty:2,stem:"小明計算 2.5＋1.2 時，把 2 的個位和 2 的十分位排在同一直行。錯在哪裡？",options:[answer,"不能做小數加法","應把兩數相乘","沒有錯"],answer,explanation:"直式計算時，小數點要對齊，才能讓個位和個位、十分位和十分位相加。",errorCode:"decimal_misalignment",prerequisite:"小數位值",variantGroup:"decimal-error"}));}
    }
    return out;
  }

  function bookFromUnit(unit, fallbackBook=3) {
    const match=String(unit||"").match(/^(\d+)-/);
    return match ? Number(match[1]) : fallbackBook;
  }
  function generalTopic(unit,book){
    if(String(unit).endsWith("-1"))return `第 ${book} 冊算術應用題`;
    if(String(unit).endsWith("-5"))return `第 ${book} 冊總複習`;
    if(unit==="mixed")return "跨單元綜合應用";
    return `第 ${book} 冊綜合應用練習`;
  }
  function arithmeticQuestions(student,count,unit,offset=0,fallbackBook=3){
    const out=[],book=bookFromUnit(unit,fallbackBook),topic=generalTopic(unit,book);
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%10,id=`${student}-${unit}-${String(i+1).padStart(3,"0")}`;
      const scale=book<=4?1:book<=6?10:book<=8?100:200,round=Math.floor(i/10);
      const smallA=20+(i*7+round*3)%40,smallB=10+(i*5+round*7)%25;
      const a=smallA*scale,b=smallB*scale;
      const common={id,student,book,unit,topic,status:"provisional",generatorKey:"arithmetic"};
      if(mode===0){
        const x=book<=4?smallA:a,y=book<=4?smallB:b,answer=x+y;
        out.push(q({...common,skill:"加法應用",questionType:"application",difficulty:1,
          stem:`圖書角原有 ${x} 本書，又補進 ${y} 本，現在共有多少本？`,options:numericOptions(answer,[x-y,answer+10,Math.max(0,answer-10)]),answer:`${answer}`,
          explanation:`求合起來的數量，用加法：${x}＋${y}＝${answer}。`,errorCode:"application_add",prerequisite:"理解共有多少",variantGroup:`${unit}-add`,audit:{op:"add",values:[x,y],result:answer}}));
      }else if(mode===1){
        const remain=book<=4?smallA:a,used=book<=4?smallB:b,total=remain+used;
        out.push(q({...common,skill:"減法應用",questionType:"application",difficulty:1,
          stem:`倉庫原有 ${total} 個物品，送出 ${used} 個後，還剩多少個？`,options:numericOptions(remain,[total+used,total,Math.max(0,remain-10)]),answer:`${remain}`,
          explanation:`求剩下的數量，用減法：${total}－${used}＝${remain}。`,errorCode:"application_subtract",prerequisite:"理解還剩多少",variantGroup:`${unit}-sub`,audit:{op:"sub",values:[total,used],result:remain}}));
      }else if(mode===2){
        const groups=3+i%7,each=book<=4?2+i%8:book<=6?12+i%18:24+i%27,total=groups*each;
        out.push(q({...common,skill:"乘法應用",questionType:"application",difficulty:book<=4?1:2,
          stem:`每盒有 ${each} 枝筆，共有 ${groups} 盒，一共有多少枝筆？`,options:numericOptions(total,[each+groups,total-each,total+groups]),answer:`${total}`,
          explanation:`每盒數量相同，用乘法：${each}×${groups}＝${total}。`,errorCode:"application_multiply",prerequisite:"理解幾個幾",variantGroup:`${unit}-mul`,audit:{op:"mul",values:[each,groups],result:total}}));
      }else if(mode===3){
        const groups=3+i%7,each=book<=4?2+i%8:book<=6?8+i%17:15+i%26,total=groups*each;
        out.push(q({...common,skill:"平均分除法",questionType:"application",difficulty:2,
          stem:`${total} 顆糖平均分給 ${groups} 人，每人可以分到幾顆？`,options:numericOptions(each,[groups,total-groups,each+2]),answer:`${each}`,
          explanation:`平均分要用除法：${total}÷${groups}＝${each}。`,errorCode:"application_divide",prerequisite:"乘除互逆",variantGroup:`${unit}-div`,audit:{op:"div",values:[total,groups],result:each}}));
      }else if(mode===4){
        const capacity=4+i%6,full=5+i%9,remainder=1+i%(capacity-1),people=capacity*full+remainder,answer=full+1;
        out.push(q({...common,skill:"有餘數的分組",questionType:"application",difficulty:2,
          stem:`${people} 人搭車，每輛最多坐 ${capacity} 人，至少需要幾輛車？`,options:numericOptions(answer,[full,answer+1,Math.max(1,answer-2)]),answer:`${answer}`,
          explanation:`${people}÷${capacity}＝${full} 餘 ${remainder}，剩下的人仍需要一輛，所以至少要 ${answer} 輛。`,errorCode:"remainder_round_up",prerequisite:"有餘數除法",variantGroup:`${unit}-remainder`,audit:{op:"ceilDiv",values:[people,capacity],result:answer}}));
      }else if(mode===5){
        const start=(book<=4?35:350*scale),arrive=(book<=4?12+i%18:12*scale+(i%9)*scale),leave=(book<=4?5+i%9:5*scale+(i%4)*scale),answer=start+arrive-leave;
        out.push(q({...common,skill:"兩步驟加減",questionType:"application",difficulty:2,
          stem:`場內原有 ${start} 人，後來進入 ${arrive} 人，又有 ${leave} 人離開，現在有多少人？`,options:numericOptions(answer,[start+arrive,start-leave,answer+leave]),answer:`${answer}`,
          explanation:`先加上進入的人，再減去離開的人：${start}＋${arrive}－${leave}＝${answer}。`,errorCode:"two_step_order",prerequisite:"依情境判斷加減",variantGroup:`${unit}-two-step`,audit:{op:"addSub",values:[start,arrive,leave],result:answer}}));
      }else if(mode===6){
        const start=8*60+(i%8)*10,duration=20+(i%8)*10,end=start+duration,answer=`${duration} 分鐘`;
        out.push(q({...common,skill:"經過時間應用",questionType:"application",difficulty:2,
          stem:`練習從 ${timeText(start)} 開始，到 ${timeText(end)} 結束，共經過多久？`,options:unique([answer,`${duration+10} 分鐘`,`${Math.max(5,duration-10)} 分鐘`,`${duration} 小時`]),answer,
          explanation:`結束時刻減去開始時刻，共經過 ${duration} 分鐘。`,errorCode:"elapsed_time_application",prerequisite:"時間往後推",variantGroup:`${unit}-time`,audit:{op:"sub",values:[end,start],result:duration}}));
      }else if(mode===7){
        const price=35+(i*17)%(book<=4?60:360),paid=Math.ceil((price+20)/100)*100,answer=paid-price;
        out.push(q({...common,skill:"金錢找零應用",questionType:"application",difficulty:2,
          stem:`買東西花了 ${price} 元，付 ${paid} 元，應找回多少元？`,options:numericOptions(answer,[price,paid+price,answer+10]),answer:`${answer}`,
          explanation:`找回金額＝付款金額－商品價格：${paid}－${price}＝${answer} 元。`,errorCode:"money_change_application",prerequisite:"減法",variantGroup:`${unit}-money`,audit:{op:"sub",values:[paid,price],result:answer}}));
      }else if(mode===8){
        const fewer=book<=4?smallB:b,more=fewer+(book<=4?15+i%20:15*scale+(i%8)*scale),answer=more-fewer;
        out.push(q({...common,skill:"相差多少應用",questionType:"application",difficulty:1,
          stem:`甲隊收集了 ${more} 個瓶蓋，乙隊收集了 ${fewer} 個，甲隊比乙隊多多少個？`,options:numericOptions(answer,[more+fewer,more,fewer]),answer:`${answer}`,
          explanation:`求相差多少，用減法：${more}－${fewer}＝${answer}。`,errorCode:"difference_application",prerequisite:"比較型減法",variantGroup:`${unit}-difference`,audit:{op:"sub",values:[more,fewer],result:answer}}));
      }else if(book<=4){
        const bags=2+i%5,red=3+i%7,blue=2+i%6,answer=bags*(red+blue);
        out.push(q({...common,skill:"兩步驟乘法",questionType:"application",difficulty:2,
          stem:`每袋有 ${red} 顆紅球和 ${blue} 顆藍球，共有 ${bags} 袋，全部有幾顆球？`,options:numericOptions(answer,[red+blue,bags*red,answer+bags]),answer:`${answer}`,
          explanation:`每袋有 ${red+blue} 顆，${bags} 袋共有（${red}＋${blue}）×${bags}＝${answer} 顆。`,errorCode:"two_step_multiply",prerequisite:"先算每份再算全部",variantGroup:`${unit}-review`,audit:{op:"groupSum",values:[red,blue,bags],result:answer}}));
      }else if(book<=6){
        const length=8+i%13,width=4+i%7,answer=2*(length+width);
        out.push(q({...common,skill:"長方形周長",questionType:"application",difficulty:2,
          stem:`一個長方形長 ${length} 公分、寬 ${width} 公分，它的周長是多少公分？`,options:numericOptions(answer,[length*width,length+width,answer+2]),answer:`${answer}`,
          explanation:`長方形周長＝（長＋寬）×2＝（${length}＋${width}）×2＝${answer} 公分。`,errorCode:"perimeter_formula",prerequisite:"長方形邊長",variantGroup:`${unit}-review`,audit:{op:"perimeter",values:[length,width],result:answer}}));
      }else if(book<=8){
        const denominator=6+i%5,numerator=1+i%(denominator-2),used=1+(i*3)%(denominator-numerator),remain=denominator-numerator-used,answer=`${remain}/${denominator}`;
        out.push(q({...common,skill:"同分母分數減法",questionType:"application",difficulty:2,
          stem:`一條緞帶全長看成 ${denominator}/${denominator}，先用掉 ${numerator}/${denominator}，再用掉 ${used}/${denominator}，還剩多少？`,options:unique([answer,`${denominator-numerator}/${denominator}`,`${numerator+used}/${denominator}`,`${remain}/${denominator+1}`]),answer,
          explanation:`同分母分數只計算分子：${denominator}－${numerator}－${used}＝${remain}，所以剩 ${answer}。`,errorCode:"fraction_same_denominator",prerequisite:"同分母分數",variantGroup:`${unit}-review`,audit:{op:"fractionRemain",values:[denominator,numerator,used],result:remain}}));
      }else{
        const x=10+(i%30)/10,y=2+(i%20)/10,answer=(x+y).toFixed(1);
        out.push(q({...common,skill:"小數加法應用",questionType:"application",difficulty:2,
          stem:`甲段繩長 ${x.toFixed(1)} 公尺，乙段繩長 ${y.toFixed(1)} 公尺，接起來共長多少公尺？`,options:unique([answer,(x-y).toFixed(1),(x+y+1).toFixed(1),(x+y-.1).toFixed(1)]),answer,
          explanation:`求合起來的長度，用加法：${x.toFixed(1)}＋${y.toFixed(1)}＝${answer} 公尺。`,errorCode:"decimal_add_application",prerequisite:"一位小數加法",variantGroup:`${unit}-review`,audit:{op:"decimalAdd",values:[x,y],result:Number(answer)}}));
      }
    }
    return out;
  }

  function fractionOptions(answer,numerator,denominator,extras=[]){
    const options=unique([answer,...extras]);let bump=1;
    while(options.length<4){const candidate=`${numerator+bump++}/${denominator}`;if(!options.includes(candidate))options.push(candidate);}
    return options.slice(0,4);
  }
  function decimalOptions(answer,extras=[]){
    const options=unique([answer,...extras]);let bump=1;
    while(options.length<4){const candidate=(Number(answer)+bump++/10).toFixed(2);if(!options.includes(candidate))options.push(candidate);}
    return options.slice(0,4);
  }
  function geometryTwoQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%5,id=`${student}-3-2-${String(i+1).padStart(3,"0")}`,copies=2+i%7;
      const common={id,student,book:3,unit:"3-2",topic:"圖形（二）",status:"verified"};
      if(mode===0){const answer=3*copies;out.push(q({...common,skill:"三角形的邊",questionType:"basic",difficulty:1,stem:`桌上有 ${copies} 個分開的三角形，每個三角形有 3 條邊，一共有幾條邊？`,options:numericOptions(answer,[copies+3,4*copies,answer-1]),answer:`${answer}`,explanation:`每個三角形有 3 條邊，${copies}×3＝${answer}。`,errorCode:"shape_triangle_sides",prerequisite:"認識三角形",variantGroup:"3-2-triangle",audit:{op:"mul",values:[copies,3],result:answer}}));}
      else if(mode===1){const answer=4*copies;out.push(q({...common,skill:"四邊形的頂點",questionType:"basic",difficulty:1,stem:`有 ${copies} 個分開的長方形，每個長方形有 4 個頂點，共有幾個頂點？`,options:numericOptions(answer,[copies+4,3*copies,answer+2]),answer:`${answer}`,explanation:`每個長方形有 4 個頂點，${copies}×4＝${answer}。`,errorCode:"shape_rectangle_vertices",prerequisite:"認識長方形",variantGroup:"3-2-rectangle",audit:{op:"mul",values:[copies,4],result:answer}}));}
      else if(mode===2){const rows=2+i%4,columns=3+(i*2)%5,answer=rows*columns;out.push(q({...common,skill:"方格排列",questionType:"basic",difficulty:2,stem:`小正方形排成 ${rows} 排，每排 ${columns} 個，共用了幾個小正方形？`,options:numericOptions(answer,[rows+columns,answer-columns,answer+rows]),answer:`${answer}`,explanation:`每排 ${columns} 個，共 ${rows} 排：${rows}×${columns}＝${answer}。`,errorCode:"shape_grid_count",prerequisite:"整齊排列",variantGroup:"3-2-grid",audit:{op:"mul",values:[rows,columns],result:answer}}));}
      else if(mode===3){const sides=3+i%4,names={3:"三角形",4:"四邊形",5:"五邊形",6:"六邊形"},answer=names[sides];out.push(q({...common,skill:"依邊數辨認圖形",questionType:"basic",difficulty:1,stem:`一個封閉圖形有 ${sides} 條直邊，依邊數應稱為什麼圖形？`,options:unique([answer,names[sides===3?4:3],names[sides===6?5:6],"圓形"]),answer,explanation:`依邊數命名，有 ${sides} 條邊的是${answer}。`,errorCode:"shape_name_by_sides",prerequisite:"數邊與頂點",variantGroup:"3-2-name"}));}
      else{const triangles=1+i%5,squares=1+(i*3)%4,answer=triangles*3+squares*4;out.push(q({...common,skill:"混合圖形數邊",questionType:"application",difficulty:2,stem:`紙上有 ${triangles} 個分開的三角形和 ${squares} 個分開的正方形，全部共有幾條邊？`,options:numericOptions(answer,[triangles+squares,triangles*4+squares*3,answer-3]),answer:`${answer}`,explanation:`三角形各有 3 邊、正方形各有 4 邊：${triangles}×3＋${squares}×4＝${answer}。`,errorCode:"shape_mixed_sides",prerequisite:"三角形與正方形",variantGroup:"3-2-mixed",audit:{op:"weightedSum",values:[triangles,3,squares,4],result:answer}}));}
    }
    return out;
  }
  function fractionOneQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%6,id=`${student}-5-2-${String(i+1).padStart(3,"0")}`,denominator=4+i%7,numerator=1+i%(denominator-1);
      const common={id,student,book:5,unit:"5-2",topic:"分數（一）",status:"verified"};
      if(mode===0){const answer=`${numerator}/${denominator}`;out.push(q({...common,skill:"部分占全體",questionType:"basic",difficulty:1,stem:`一個披薩平均切成 ${denominator} 片，吃掉 ${numerator} 片，吃掉全部的幾分之幾？`,options:fractionOptions(answer,numerator,denominator,[`${denominator}/${numerator}`,`1/${denominator}`,`${numerator}/${denominator+1}`]),answer,explanation:`分母是全部 ${denominator} 片，分子是吃掉的 ${numerator} 片，所以是 ${answer}。`,errorCode:"fraction_part_whole",prerequisite:"平均分",variantGroup:"5-2-part",audit:{op:"fraction",values:[numerator,denominator],result:numerator/denominator}}));}
      else if(mode===1){const groups=2+i%5,total=denominator*groups,selected=numerator*groups,answer=`${numerator}/${denominator}`;out.push(q({...common,skill:"集合中的分數",questionType:"application",difficulty:2,stem:`盒中有 ${total} 顆球，其中 ${selected} 顆是藍色。藍球占全部的幾分之幾？`,options:fractionOptions(answer,numerator,denominator,[`${selected}/${denominator}`,`${denominator}/${numerator}`,`${numerator+1}/${denominator}`]),answer,explanation:`${total} 顆平均看成 ${denominator} 份，每份 ${groups} 顆；${selected} 顆是其中 ${numerator} 份，所以是 ${answer}。`,errorCode:"fraction_set",prerequisite:"等分集合",variantGroup:"5-2-set",audit:{op:"fraction",values:[selected,total],result:selected/total}}));}
      else if(mode===2){const other=numerator===1?2:numerator-1,answer=numerator>other?`${numerator}/${denominator}`:`${other}/${denominator}`;out.push(q({...common,skill:"同分母分數比較",questionType:"basic",difficulty:1,stem:`${numerator}/${denominator} 和 ${other}/${denominator}，哪一個比較大？`,options:fractionOptions(answer,numerator,denominator,[`${other}/${denominator}`,"一樣大",`${denominator}/${numerator}`]),answer,explanation:"分母相同時，分子較大的分數較大。",errorCode:"fraction_same_denominator_compare",prerequisite:"同分母分數",variantGroup:"5-2-compare"}));}
      else if(mode===3){const d2=denominator+2,answer=`1/${denominator}`;out.push(q({...common,skill:"單位分數比較",questionType:"basic",difficulty:2,stem:`1/${denominator} 和 1/${d2}，哪一個比較大？`,options:fractionOptions(answer,1,denominator,[`1/${d2}`,"一樣大",`${denominator}/${d2}`]),answer,explanation:"同樣都是一份，平均分的份數越少，每一份越大。",errorCode:"unit_fraction_compare",prerequisite:"單位分數",variantGroup:"5-2-unit"}));}
      else if(mode===4){const answer=denominator;out.push(q({...common,skill:"幾個單位分數合成1",questionType:"basic",difficulty:1,stem:`幾個 1/${denominator} 合起來等於 1？`,options:numericOptions(answer,[denominator-1,denominator+1,numerator]),answer:`${answer}`,explanation:`${denominator} 個 1/${denominator} 就是 ${denominator}/${denominator}＝1。`,errorCode:"fraction_make_one",prerequisite:"單位分數",variantGroup:"5-2-one",audit:{op:"identity",values:[denominator],result:denominator}}));}
      else{const remain=denominator-numerator,answer=`${remain}/${denominator}`;out.push(q({...common,skill:"分數的剩餘",questionType:"application",difficulty:2,stem:`一條紙帶平均分成 ${denominator} 份，用掉其中 ${numerator} 份，還剩全長的幾分之幾？`,options:fractionOptions(answer,remain,denominator,[`${numerator}/${denominator}`,`${remain}/${denominator+1}`,`${denominator}/${remain}`]),answer,explanation:`剩下 ${denominator}－${numerator}＝${remain} 份，所以是 ${answer}。`,errorCode:"fraction_remaining",prerequisite:"全體是幾份",variantGroup:"5-2-remain",audit:{op:"sub",values:[denominator,numerator],result:remain}}));}
    }
    return out;
  }
  function statisticsWeightQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%8,id=`${student}-6-2-${String(i+1).padStart(3,"0")}`;
      const common={id,student,book:6,unit:"6-2",topic:"統計圖表（二）・重量（二）",status:"verified"};
      const a=12+(i*3)%20,b=8+(i*5)%17,c=15+(i*7)%19;
      if(mode===0){const answer=a+b+c;out.push(q({...common,skill:"統計圖表求總數",questionType:"application",difficulty:1,stem:`長條圖資料：蘋果 ${a} 票、香蕉 ${b} 票、芭樂 ${c} 票。三種水果共有多少票？`,options:numericOptions(answer,[a+b,answer-c,answer+5]),answer:`${answer}`,explanation:`把三類票數相加：${a}＋${b}＋${c}＝${answer}。`,errorCode:"chart_total",prerequisite:"讀取圖表數值",variantGroup:"6-2-chart-total",audit:{op:"sum3",values:[a,b,c],result:answer}}));}
      else if(mode===1){const high=Math.max(a,b),low=Math.min(a,b),answer=high-low;out.push(q({...common,skill:"統計圖表比較",questionType:"application",difficulty:1,stem:`調查表中，甲組有 ${high} 人、乙組有 ${low} 人，甲組比乙組多幾人？`,options:numericOptions(answer,[high+low,high,low]),answer:`${answer}`,explanation:`求相差數量：${high}－${low}＝${answer}。`,errorCode:"chart_difference",prerequisite:"比較型減法",variantGroup:"6-2-chart-diff",audit:{op:"sub",values:[high,low],result:answer}}));}
      else if(mode===2){const total=a+b+c,answer=b;out.push(q({...common,skill:"統計圖表補缺值",questionType:"application",difficulty:2,stem:`三班共回收 ${total} 個瓶子。一班 ${a} 個、三班 ${c} 個，二班回收幾個？`,options:numericOptions(answer,[a+c,total-b,b+5]),answer:`${answer}`,explanation:`二班＝總數－一班－三班：${total}－${a}－${c}＝${answer}。`,errorCode:"chart_missing_value",prerequisite:"總數與部分",variantGroup:"6-2-chart-missing",audit:{op:"sub2",values:[total,a,c],result:answer}}));}
      else if(mode===3){const kg=1+i%8,answer=kg*1000;out.push(q({...common,skill:"公斤換算公克",questionType:"basic",difficulty:1,stem:`${kg} 公斤等於多少公克？`,options:numericOptions(answer,[kg*100,kg*10,answer+100]),answer:`${answer}`,explanation:`1 公斤＝1000 公克，所以 ${kg} 公斤＝${answer} 公克。`,errorCode:"kg_to_g",prerequisite:"1公斤＝1000公克",variantGroup:"6-2-kg",audit:{op:"mul",values:[kg,1000],result:answer}}));}
      else if(mode===4){const kg=1+i%6,g=100*((i%8)+1),total=kg*1000+g,answer=`${kg} 公斤 ${g} 公克`;out.push(q({...common,skill:"公克改寫複名數",questionType:"basic",difficulty:2,stem:`${total} 公克可以寫成幾公斤幾公克？`,options:unique([answer,`${kg+1} 公斤 ${g} 公克`,`${kg} 公斤 ${g/10} 公克`,`${total} 公斤`]),answer,explanation:`${kg*1000} 公克是 ${kg} 公斤，還有 ${g} 公克。`,errorCode:"g_to_kg_g",prerequisite:"1000公克進位",variantGroup:"6-2-convert",audit:{op:"add",values:[kg*1000,g],result:total}}));}
      else if(mode===5){const x=1200+(i%7)*150,y=300+(i%5)*100,answer=x+y;out.push(q({...common,skill:"重量加法",questionType:"application",difficulty:2,stem:`一袋米重 ${x} 公克，另一袋重 ${y} 公克，合計多少公克？`,options:numericOptions(answer,[x-y,x,answer+100]),answer:`${answer}`,explanation:`合計重量用加法：${x}＋${y}＝${answer} 公克。`,errorCode:"weight_add",prerequisite:"同單位相加",variantGroup:"6-2-weight-add",audit:{op:"add",values:[x,y],result:answer}}));}
      else if(mode===6){const remain=800+(i%8)*100,used=250+(i%5)*50,total=remain+used;out.push(q({...common,skill:"重量減法",questionType:"application",difficulty:2,stem:`糖原有 ${total} 公克，用掉 ${used} 公克，還剩多少公克？`,options:numericOptions(remain,[total+used,total,remain+100]),answer:`${remain}`,explanation:`剩餘重量＝原有－用掉：${total}－${used}＝${remain} 公克。`,errorCode:"weight_subtract",prerequisite:"同單位相減",variantGroup:"6-2-weight-sub",audit:{op:"sub",values:[total,used],result:remain}}));}
      else{const labels=["甲","乙","丙"],winner=labels[i%3],values={甲:a,乙:a+4,丙:a+8};values[winner]=a+15;const answer=`${winner}組`;out.push(q({...common,skill:"統計圖表找最大值",questionType:"basic",difficulty:1,stem:`圖表資料：甲組 ${values.甲} 本、乙組 ${values.乙} 本、丙組 ${values.丙} 本。哪一組最多？`,options:["甲組","乙組","丙組","三組一樣"],answer,explanation:`比較三個數值，最大的是${answer}。`,errorCode:"chart_maximum",prerequisite:"比較三個數",variantGroup:"6-2-chart-max"}));}
    }
    return out;
  }
  function fractionThreeQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%6,id=`${student}-8-2-${String(i+1).padStart(3,"0")}`,d=4+i%7;
      const common={id,student,book:8,unit:"8-2",topic:"分數（三）",status:"verified"};
      if(mode===0){const whole=1+i%5,n=1+i%(d-1),improper=whole*d+n,answer=`${whole} 又 ${n}/${d}`;out.push(q({...common,skill:"假分數換帶分數",questionType:"basic",difficulty:2,stem:`${improper}/${d} 化成帶分數是多少？`,options:unique([answer,`${whole+1} 又 ${n}/${d}`,`${whole} 又 ${d}/${n}`,`${improper-d}/${d}`]),answer,explanation:`${improper}÷${d}＝${whole} 餘 ${n}，所以是 ${answer}。`,errorCode:"improper_to_mixed",prerequisite:"假分數",variantGroup:"8-2-improper",audit:{op:"mixedNumerator",values:[whole,d,n],result:improper}}));}
      else if(mode===1){const whole=1+i%4,n=1+(i*3)%(d-1),answer=`${whole*d+n}/${d}`;out.push(q({...common,skill:"帶分數換假分數",questionType:"basic",difficulty:2,stem:`${whole} 又 ${n}/${d} 化成假分數是多少？`,options:fractionOptions(answer,whole*d+n,d,[`${whole+n}/${d}`,`${whole*d}/${d}`,`${whole*d+n}/${d+1}`]),answer,explanation:`整數部分是 ${whole*d}/${d}，再加 ${n}/${d}，得到 ${answer}。`,errorCode:"mixed_to_improper",prerequisite:"帶分數",variantGroup:"8-2-mixed",audit:{op:"mixedNumerator",values:[whole,d,n],result:whole*d+n}}));}
      else if(mode===2){const x=1+i%(d-2),y=1+(i*2)%(d-x),sum=x+y,answer=`${sum}/${d}`;out.push(q({...common,skill:"同分母分數加法",questionType:"basic",difficulty:1,stem:`${x}/${d}＋${y}/${d}＝？`,options:fractionOptions(answer,sum,d,[`${x+y}/${d*2}`,`${Math.abs(x-y)}/${d}`,`${sum+1}/${d}`]),answer,explanation:`分母不變，分子相加：${x}＋${y}＝${sum}，答案是 ${answer}。`,errorCode:"fraction_add_same_denominator",prerequisite:"同分母",variantGroup:"8-2-add",audit:{op:"add",values:[x,y],result:sum}}));}
      else if(mode===3){const x=2+i%(d-1),y=1+i%(x-1),diff=x-y,answer=`${diff}/${d}`;out.push(q({...common,skill:"同分母分數減法",questionType:"basic",difficulty:1,stem:`${x}/${d}－${y}/${d}＝？`,options:fractionOptions(answer,diff,d,[`${x+y}/${d}`,`${diff}/${d*2}`,`${diff+1}/${d}`]),answer,explanation:`分母不變，分子相減：${x}－${y}＝${diff}，答案是 ${answer}。`,errorCode:"fraction_sub_same_denominator",prerequisite:"同分母",variantGroup:"8-2-sub",audit:{op:"sub",values:[x,y],result:diff}}));}
      else if(mode===4){const n=1+i%(d-1),factor=2+i%3,answer=`${n*factor}/${d*factor}`;out.push(q({...common,skill:"等值分數",questionType:"basic",difficulty:2,stem:`${n}/${d} 的分子、分母同乘 ${factor}，會得到哪一個等值分數？`,options:fractionOptions(answer,n*factor,d*factor,[`${n+factor}/${d+factor}`,`${n*factor}/${d}`,`${n}/${d*factor}`]),answer,explanation:`分子和分母同乘 ${factor}：${n}×${factor}/${d}×${factor}＝${answer}。`,errorCode:"equivalent_fraction",prerequisite:"等值分數",variantGroup:"8-2-equivalent",audit:{op:"fraction",values:[n,d],result:n/d}}));}
      else{const groups=2+i%6,n=1+i%(d-1),total=d*groups,answer=n*groups;out.push(q({...common,skill:"分數乘整數情境",questionType:"application",difficulty:2,stem:`一盒有 ${total} 顆珠子，其中 ${n}/${d} 是紅色，紅色珠子有幾顆？`,options:numericOptions(answer,[n*d,total-n,answer+groups]),answer:`${answer}`,explanation:`${total}÷${d}＝${groups}，每份 ${groups} 顆；${n} 份共有 ${n}×${groups}＝${answer} 顆。`,errorCode:"fraction_of_quantity",prerequisite:"分數表示部分",variantGroup:"8-2-quantity",audit:{op:"mul",values:[n,groups],result:answer}}));}
    }
    return out;
  }
  function geometryFractionFourQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%6,id=`${student}-9-3-${String(i+1).padStart(3,"0")}`;
      const common={id,student,book:9,unit:"9-3",topic:"圖形（五）・分數（四）",status:"verified"};
      if(mode===0){const a=35+(i*7)%60,b=30+(i*11)%(120-a),answer=180-a-b;out.push(q({...common,skill:"三角形內角",questionType:"basic",difficulty:2,stem:`一個三角形的兩個內角分別是 ${a}°、${b}°，第三個角是多少度？`,options:numericOptions(answer,[a+b,180-a,180-b],"°"),answer:`${answer}°`,explanation:`三角形內角和是 180°：180－${a}－${b}＝${answer}°。`,errorCode:"triangle_angle_sum",prerequisite:"三角形內角和",variantGroup:"9-3-triangle",audit:{op:"sub2",values:[180,a,b],result:answer}}));}
      else if(mode===1){const length=8+i%17,width=5+(i*3)%11,answer=2*(length+width);out.push(q({...common,skill:"平行四邊形周長",questionType:"application",difficulty:2,stem:`平行四邊形相鄰兩邊長 ${length} 公分和 ${width} 公分，周長是多少公分？`,options:numericOptions(answer,[length*width,length+width,answer+2]),answer:`${answer}`,explanation:`對邊等長，周長＝（${length}＋${width}）×2＝${answer} 公分。`,errorCode:"parallelogram_perimeter",prerequisite:"平行四邊形對邊",variantGroup:"9-3-parallelogram",audit:{op:"perimeter",values:[length,width],result:answer}}));}
      else if(mode===2){const d1=2+(i%3),d2=d1+1+(i%2),lcm=d1*d2,n1=1+i%(d1-1),n2=1+i%(d2-1),sum=n1*d2+n2*d1,answer=`${sum}/${lcm}`;out.push(q({...common,skill:"異分母分數加法",questionType:"basic",difficulty:2,stem:`${n1}/${d1}＋${n2}/${d2}＝？（答案不必約分）`,options:fractionOptions(answer,sum,lcm,[`${n1+n2}/${d1+d2}`,`${Math.abs(n1*d2-n2*d1)}/${lcm}`,`${sum+1}/${lcm}`]),answer,explanation:`通分成分母 ${lcm}：${n1*d2}/${lcm}＋${n2*d1}/${lcm}＝${answer}。`,errorCode:"fraction_unlike_add",prerequisite:"通分",variantGroup:"9-3-fraction-add",audit:{op:"fractionSum",values:[n1,d1,n2,d2],result:sum/lcm}}));}
      else if(mode===3){const d1=2+i%4,d2=d1+1,n1=d1-1,n2=1+i%(d2-1),left=n1/d1,right=n2/d2,answer=left>right?`${n1}/${d1}`:left<right?`${n2}/${d2}`:"一樣大";out.push(q({...common,skill:"異分母分數比較",questionType:"basic",difficulty:2,stem:`${n1}/${d1} 和 ${n2}/${d2}，哪一個比較大？`,options:fractionOptions(answer,n1,d1,[`${n1}/${d1}`,`${n2}/${d2}`,"一樣大"]),answer,explanation:"先通分或換成相同基準後再比較大小。",errorCode:"fraction_unlike_compare",prerequisite:"通分比較",variantGroup:"9-3-fraction-compare"}));}
      else if(mode===4){const base=30+(i*5)%80,height=20+(i*7)%60,answer=base*height/2;out.push(q({...common,skill:"三角形面積",questionType:"application",difficulty:2,stem:`三角形底 ${base} 公分、高 ${height} 公分，面積是多少平方公分？`,options:numericOptions(answer,[base*height,base+height,answer*2]),answer:`${answer}`,explanation:`三角形面積＝底×高÷2＝${base}×${height}÷2＝${answer} 平方公分。`,errorCode:"triangle_area",prerequisite:"底和高",variantGroup:"9-3-area",audit:{op:"triangleArea",values:[base,height],result:answer}}));}
      else{const d=4+i%7,x=2+i%(d-1),y=1+i%(x-1),diff=x-y,answer=`${diff}/${d}`;out.push(q({...common,skill:"分數減法應用",questionType:"application",difficulty:2,stem:`一桶水原有 ${x}/${d} 桶，用掉 ${y}/${d} 桶，還剩多少桶？`,options:fractionOptions(answer,diff,d,[`${x+y}/${d}`,`${diff}/${d*2}`,`${x-y+1}/${d}`]),answer,explanation:`同分母直接相減分子：${x}－${y}＝${diff}，剩 ${answer} 桶。`,errorCode:"fraction_sub_application",prerequisite:"同分母分數減法",variantGroup:"9-3-fraction-sub",audit:{op:"sub",values:[x,y],result:diff}}));}
    }
    return out;
  }
  function decimalThreeQuestions(student,count,offset=0){
    const out=[];
    for(let localIndex=0;localIndex<count;localIndex++){
      const i=localIndex+offset,mode=i%6,id=`${student}-9-4-${String(i+1).padStart(3,"0")}`;
      const common={id,student,book:9,unit:"9-4",topic:"小數（三）",status:"verified"};
      const x=Number((2+(i*7)%60/100).toFixed(2)),y=Number((1+(i*11)%40/100).toFixed(2));
      if(mode===0){const hundredth=Math.round(x*100)%10,answer=`${hundredth}`;out.push(q({...common,skill:"百分位位值",questionType:"basic",difficulty:1,stem:`小數 ${x.toFixed(2)} 的百分位數字是多少？`,options:numericOptions(hundredth,[Math.floor(x*10)%10,Math.floor(x),Math.round(x*100)]),answer,explanation:"小數點右邊第二位是百分位。",errorCode:"decimal_hundredths_place",prerequisite:"十分位與百分位",variantGroup:"9-4-place"}));}
      else if(mode===1){const other=Number((x+0.01*(1+i%5)).toFixed(2)),answer=other>x?other.toFixed(2):x.toFixed(2);out.push(q({...common,skill:"兩位小數比較",questionType:"basic",difficulty:1,stem:`${x.toFixed(2)} 和 ${other.toFixed(2)}，哪一個比較大？`,options:decimalOptions(answer,[x.toFixed(2),other.toFixed(2),(x+other).toFixed(2)]),answer,explanation:"從個位、十分位到百分位依序比較。",errorCode:"decimal_compare_hundredths",prerequisite:"小數位值",variantGroup:"9-4-compare"}));}
      else if(mode===2){const answer=(x+y).toFixed(2);out.push(q({...common,skill:"兩位小數加法",questionType:"basic",difficulty:2,stem:`${x.toFixed(2)}＋${y.toFixed(2)}＝？`,options:decimalOptions(answer,[(x-y).toFixed(2),(x+y+1).toFixed(2),(x+y-.1).toFixed(2)]),answer,explanation:`小數點對齊後相加，答案是 ${answer}。`,errorCode:"decimal_add_hundredths",prerequisite:"小數點對齊",variantGroup:"9-4-add",audit:{op:"decimalAdd",values:[x,y],result:Number(answer)}}));}
      else if(mode===3){const larger=x+y,answer=(larger-y).toFixed(2);out.push(q({...common,skill:"兩位小數減法",questionType:"basic",difficulty:2,stem:`${larger.toFixed(2)}－${y.toFixed(2)}＝？`,options:decimalOptions(answer,[(larger+y).toFixed(2),(larger-y+.1).toFixed(2),(larger-y-1).toFixed(2)]),answer,explanation:`小數點對齊後相減，答案是 ${answer}。`,errorCode:"decimal_sub_hundredths",prerequisite:"退位減法",variantGroup:"9-4-sub",audit:{op:"decimalSub",values:[larger,y],result:Number(answer)}}));}
      else if(mode===4){const answer=(x*10).toFixed(1);out.push(q({...common,skill:"小數乘10",questionType:"basic",difficulty:2,stem:`${x.toFixed(2)}×10＝？`,options:unique([answer,x.toFixed(2),(x/10).toFixed(3),(x*100).toFixed(0)]),answer,explanation:`乘 10 後每個數字的位值放大 10 倍，答案是 ${answer}。`,errorCode:"decimal_times_ten",prerequisite:"位值變化",variantGroup:"9-4-times10",audit:{op:"mul",values:[x,10],result:Number(answer)}}));}
      else{const metres=Number((3+(i*13)%70/100).toFixed(2)),used=Number((1+(i*5)%30/100).toFixed(2)),remain=Number((metres-used).toFixed(2)),answer=remain.toFixed(2);out.push(q({...common,skill:"小數減法應用",questionType:"application",difficulty:2,stem:`繩子長 ${metres.toFixed(2)} 公尺，用掉 ${used.toFixed(2)} 公尺，還剩多少公尺？`,options:decimalOptions(answer,[(metres+used).toFixed(2),metres.toFixed(2),(remain+.1).toFixed(2)]),answer,explanation:`剩餘長度＝${metres.toFixed(2)}－${used.toFixed(2)}＝${answer} 公尺。`,errorCode:"decimal_length_sub",prerequisite:"兩位小數減法",variantGroup:"9-4-application",audit:{op:"decimalSub",values:[metres,used],result:remain}}));}
    }
    return out;
  }

  const GENERATORS = {
    "3-2":geometryTwoQuestions,"3-3":moneyQuestions,"3-4":timeQuestions,"5-2":fractionOneQuestions,
    "6-1":integerQuestions,"6-2":statisticsWeightQuestions,"6-4":decimalQuestions,
    "8-2":fractionThreeQuestions,"9-3":geometryFractionFourQuestions,"9-4":decimalThreeQuestions
  };
  function materialize(base, seed=Date.now()) {
    if (!base || base.status === "pending") return Object.assign({}, base, { dynamic:false });
    // 概念辨識與找錯題保留固定敘述；操作、計算、生活應用才重新生成數字。
    if (base.questionType !== "basic" && base.questionType !== "application") {
      return Object.assign({}, base, { sourceId:base.id, variantKey:`${base.id}:fixed`, dynamic:false });
    }
    const generator = GENERATORS[base.unit];
    if (!generator && base.generatorKey!=="arithmetic") return Object.assign({}, base, { sourceId:base.id, variantKey:`${base.id}:fixed`, dynamic:false });
    const numericSeed = Math.abs(Number(seed) || 1);
    let generated = null;
    for (let attempt=0; attempt<12 && (!generated || generated.stem === base.stem); attempt++) {
      const offset = 64 + (numericSeed + attempt * 97) % 12000;
      const candidates=base.generatorKey==="arithmetic"
        ? arithmeticQuestions(base.student,32,base.unit,offset,base.book)
        : generator(base.student,32,offset);
      const sameSkill=candidates.filter(item => item.skill === base.skill);
      generated = sameSkill[(numericSeed+attempt*3)%sameSkill.length] || generated;
    }
    if (!generated) return Object.assign({}, base, { sourceId:base.id, variantKey:`${base.id}:fixed`, dynamic:false });
    return Object.assign({}, generated, {
      id:base.id, sourceId:base.id, student:base.student, status:base.status,
      variantKey:`${base.id}:${numericSeed}`, dynamic:true
    });
  }
  function buildBank(student, config) {
    const bank=[],fallbackBook=Math.max(...config.plan.map(([unit])=>bookFromUnit(unit,0)));
    config.plan.forEach(([unit,count]) => {
      if (String(unit).endsWith("-1") || String(unit).endsWith("-5")) bank.push(...arithmeticQuestions(student,count,unit,0,fallbackBook));
      else if (GENERATORS[unit]) bank.push(...GENERATORS[unit](student,count));
      else bank.push(...arithmeticQuestions(student,count,unit,0,fallbackBook));
    });
    return bank;
  }

  const BANKS = Object.fromEntries(Object.entries(STUDENTS).map(([student,config]) => [student,buildBank(student,config)]));
  window.WEDNESDAY_REVIEW_DATA = { students:STUDENTS, unitMeta:UNIT_META, banks:BANKS, materialize };
})();
