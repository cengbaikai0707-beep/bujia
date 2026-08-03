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
    "3-3": { topic:"用錢（二）", status:"verified" },
    "3-4": { topic:"時間（三）", status:"verified" },
    "6-1": { topic:"整數（六）安全範圍", status:"provisional" },
    "6-4": { topic:"小數（一）", status:"verified" }
  };

  const unique = values => [...new Set(values.map(value => String(value)))];
  function numericOptions(answer, distractors, suffix="") {
    const options = unique([answer, ...distractors]).slice(0, 4);
    let step = Math.max(1, Math.round(Math.abs(Number(answer) || 1) / 10));
    while (options.length < 4) options.push(String(Number(answer) + step++));
    return options.map(value => `${value}${suffix}`);
  }
  function q(base) {
    return Object.assign({
      questionType:"basic", difficulty:1, prerequisite:"", errorCode:"unknown",
      explanation:"", status:"verified"
    }, base);
  }

  function moneyQuestions(student, count) {
    const out = [];
    for (let i=0; i<count; i++) {
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
  function timeQuestions(student, count) {
    const out=[];
    for(let i=0;i<count;i++){
      const mode=i%6,id=`${student}-3-4-${String(i+1).padStart(3,"0")}`;
      const start=8*60+(i%6)*10, duration=20+(i%5)*10, end=start+duration;
      if(mode===0){
        const answer=`${duration} 分鐘`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"經過幾分鐘",questionType:"basic",difficulty:1,
          stem:`活動從 ${timeText(start)} 開始，到 ${timeText(end)} 結束，共經過多久？`,options:[answer,`${duration+10} 分鐘`,`${Math.max(5,duration-10)} 分鐘`,`${duration} 小時`],answer,
          explanation:`從 ${timeText(start)} 往後數到 ${timeText(end)}，共 ${duration} 分鐘。`,errorCode:"elapsed_time",prerequisite:"5 分鐘刻度",variantGroup:"time-elapsed"}));
      }else if(mode===1){
        const answer=timeText(end);
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"求結束時間",questionType:"application",difficulty:2,
          stem:`小美 ${timeText(start)} 開始閱讀，讀了 ${duration} 分鐘，幾點結束？`,options:[answer,timeText(end+10),timeText(start-duration),timeText(start+duration+60)],answer,
          explanation:`開始時間往後加 ${duration} 分鐘，得到 ${answer}。`,errorCode:"time_end_forward",prerequisite:"時間往後推",variantGroup:"time-end"}));
      }else if(mode===2){
        const answer=timeText(start);
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"反推開始時間",questionType:"application",difficulty:2,
          stem:`一堂活動在 ${timeText(end)} 結束，共進行 ${duration} 分鐘。活動幾點開始？`,options:[answer,timeText(end+duration),timeText(start-10),timeText(end-duration+60)],answer,
          explanation:`已知結束時間，要往前退 ${duration} 分鐘，得到 ${answer}。`,errorCode:"time_start_backward",prerequisite:"時間往前推",variantGroup:"time-start"}));
      }else if(mode===3){
        const a=timeText(start),b=timeText(start+25),answer=`${a} 比較早`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"判斷先後",questionType:"concept",difficulty:1,
          stem:`甲事情在 ${a} 發生，乙事情在 ${b} 發生。哪一個比較早？`,options:[answer,`${b} 比較早`,"同時發生","無法判斷"],answer,
          explanation:`同一天中，時刻較小的 ${a} 先發生。`,errorCode:"time_sequence",prerequisite:"讀數字時間",variantGroup:"time-order"}));
      }else if(mode===4){
        const minutes=(i%10)*5,answer=`${minutes} 分`;
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"分針與刻度",questionType:"concept",difficulty:1,
          stem:`分針從 12 走到鐘面上的 ${minutes/5 || 12}，代表走了幾分鐘？`,options:[answer,`${minutes/5 || 12} 分`,`${minutes+5} 分`,`60 分`],answer,
          explanation:`鐘面每一大格是 5 分鐘，所以用走過的大格數乘以 5。`,errorCode:"clock_hand_scale",prerequisite:"5 的倍數",variantGroup:"clock-minute"}));
      }else{
        const answer="把分鐘當成十進位，沒有用 60 分鐘進一小時";
        out.push(q({id,student,book:3,unit:"3-4",topic:"時間（三）",skill:"找錯訂正",questionType:"error",difficulty:2,
          stem:"小安說：8:50 再過 20 分鐘是 8:70。錯誤原因是什麼？",options:[answer,"時針與分針看反","應該用減法","沒有錯"],answer,
          explanation:"60 分鐘要換成 1 小時，所以 8:50 再過 20 分鐘是 9:10。",errorCode:"time_base60",prerequisite:"60 分鐘＝1 小時",variantGroup:"time-error"}));
      }
    }
    return out;
  }

  function integerQuestions(student,count){
    const out=[];
    for(let i=0;i<count;i++){
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

  function decimalQuestions(student,count){
    const out=[];
    for(let i=0;i<count;i++){
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

  const GENERATORS = { "3-3":moneyQuestions, "3-4":timeQuestions, "6-1":integerQuestions, "6-4":decimalQuestions };
  function pendingQuestion(student, unit, index) {
    return {
      id:`${student}-${unit}-${String(index+1).padStart(3,"0")}`, student, unit,
      topic:unit === "mixed" ? "混合題" : "待單元總表核定", status:"pending",
      questionType:"pending", difficulty:0, skill:"待核定", errorCode:"pending",
      stem:"", options:[], answer:"", explanation:""
    };
  }
  function buildBank(student, config) {
    const bank=[];
    config.plan.forEach(([unit,count]) => {
      if (GENERATORS[unit]) bank.push(...GENERATORS[unit](student,count));
      else for(let i=0;i<count;i++) bank.push(pendingQuestion(student,unit,i));
    });
    return bank;
  }

  const BANKS = Object.fromEntries(Object.entries(STUDENTS).map(([student,config]) => [student,buildBank(student,config)]));
  window.WEDNESDAY_REVIEW_DATA = { students:STUDENTS, unitMeta:UNIT_META, banks:BANKS };
})();
