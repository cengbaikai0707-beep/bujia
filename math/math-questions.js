/* 數感偵探社題庫：共 150 題。
   基礎補強 42、四年級共學 60、進階延伸 48；每條路徑均含位值、加減、乘法、除法、估算、應用六類。
   後半段為數感直覺擴充題，挑戰題比例已提高。 */
(function(){
  const bank=[];
  const modes=["quick","practice","check"];
  const zh=n=>Number(n).toLocaleString("zh-TW");
  const uniq=a=>[...new Set(a.map(String))];
  function numberOptions(answer, others, unit=""){
    const values=uniq([answer,...others]);
    let bump=1;
    while(values.length<4){
      const candidate=String(Number(answer)+bump*10);
      if(!values.includes(candidate)) values.push(candidate);
      bump++;
    }
    return values.slice(0,4).map(v=>`${zh(v)}${unit}`);
  }
  function add(path,skill,i,difficulty,question,answer,others,explanation,hint,unit=""){
    bank.push({id:`MATH-${path}-${skill}-${String(i).padStart(2,"0")}`,subject:"math",path,
      mode:modes,skillType:skill,difficulty,question,
      options:numberOptions(answer,others,unit),answerIndex:0,explanation,
      correctFeedback:"判斷正確，而且方法可以說得清楚。",wrongHint:hint});
  }

  // 基礎補強：短題、明確指令、先穩定位值與基本四則。
  for(let i=1;i<=5;i++){
    const n=3247+i*111, hundreds=Math.floor(n/100)%10*100;
    add("foundation","位值",i,"基礎",`${zh(n)}中的百位數字代表多少？`,hundreds,[hundreds/10,hundreds*10,Math.floor(n/100)%10],`百位上的數字是${hundreds/100}，代表${hundreds/100}個百，也就是${hundreds}。`,"先由右往左找：個位、十位、百位。");
    const a=236+i*23,b=142+i*12,ans=a+b;
    add("foundation","加減",i,"基礎",`${a}＋${b}＝？`,ans,[ans-10,ans+10,ans-100],`把百位、十位、個位依序相加，答案是${ans}。`,"先把兩個數都拆成百、十、個。");
    const x=23+i*4,y=3+(i%3),prod=x*y;
    add("foundation","乘法",i,"基礎",`${x}×${y}＝？`,prod,[prod-y,prod+y,prod+10],`${x}個${y}或${y}個${x}，相乘得到${prod}。`,"可以把兩位數拆成整十和個位再乘。");
    const q=6+i*2,d=2+(i%4),total=q*d;
    add("foundation","除法",i,"基礎",`${total}平均分成${d}份，每份是多少？`,q,[q-1,q+1,d],`${total}÷${d}＝${q}，因為${d}×${q}＝${total}。`,"用乘法想：除數乘以多少會得到總數？");
    const raw=143+i*37,rounded=Math.round(raw/10)*10;
    add("foundation","估算",i,"基礎",`${raw}四捨五入到十位，約是多少？`,rounded,[rounded-10,rounded+10,Math.round(raw/100)*100],`看個位數決定十位：${raw}約是${rounded}。`,"只看個位：0～4捨去，5～9進一。");
    const packs=4+i,each=8+i,total2=packs*each;
    add("foundation","應用",i,"標準",`有${packs}盒色筆，每盒${each}枝，一共有幾枝？`,total2,[total2-each,total2+each,packs+each],`${packs}個${each}用乘法：${packs}×${each}＝${total2}。`,"題目是幾個相同數量，可以用乘法。","枝");
  }

  // 四年級共學：共同核心，包含估算、餘數與兩步驟情境。
  for(let i=1;i<=5;i++){
    const n=23846+i*1379,digit=Math.floor(n/1000)%10,value=digit*1000;
    add("common","位值",i,"標準",`${zh(n)}中的千位數字代表多少？`,value,[digit,value/10,value*10],`千位數字是${digit}，代表${digit}個千，也就是${zh(value)}。`,"先從右邊個位開始，往左數到千位。");
    const a=1700+i*146,b=850+i*73,c=320+i*21,ans=a+b-c;
    add("common","加減",i,"標準",`${zh(a)}＋${zh(b)}－${zh(c)}＝？`,ans,[ans-100,ans+100,a+b+c],`先算${a}＋${b}＝${a+b}，再減${c}，得到${ans}。`,"依照由左到右分成兩步驟計算。");
    const x=126+i*17,y=3+(i%4),prod=x*y;
    add("common","乘法",i,"標準",`${x}×${y}＝？`,prod,[prod-y*10,prod+y*10,x+y],`可把${x}拆成整百、整十和個位，再分別乘${y}，合起來是${prod}。`,"用分配的方法：先乘百位，再乘十位和個位。");
    const divisor=6+i,remainder=i%3+1,quot=12+i*3,total=divisor*quot+remainder;
    add("common","除法",i,"標準",`${total}÷${divisor}的商和餘數合起來寫成「商×10＋餘數」，結果是多少？`,quot*10+remainder,[quot*10,quot*10+remainder+1,(quot+1)*10+remainder],`${total}＝${divisor}×${quot}＋${remainder}，商是${quot}、餘數是${remainder}，所以結果是${quot*10+remainder}。`,"先求商和餘數，再依題目的方式組合。");
    const price=187+i*21,count=3+(i%3),estimate=Math.round(price/100)*100*count;
    add("common","估算",i,"標準",`一件物品${price}元，買${count}件。把單價估成最接近的整百後，大約多少元？`,estimate,[estimate-100,estimate+100,Math.round(price/10)*10*count],`${price}最接近${Math.round(price/100)*100}，再乘${count}，約是${estimate}元。`,"先把單價看成最接近的整百，再乘件數。","元");
    const boxes=5+i,per=24+i*2,give=17+i,total2=boxes*per-give;
    add("common","應用",i,"標準",`老師買${boxes}盒貼紙，每盒${per}張，送出${give}張後還剩多少張？`,total2,[boxes*per,total2+give,total2-per],`先算共有${boxes}×${per}＝${boxes*per}張，再減去${give}張，剩${total2}張。`,"先找原本總數，再扣掉送出的數量。","張");
  }

  // 進階延伸：仍守在小學範圍，用逆推、比較與多步驟推理。
  for(let i=1;i<=5;i++){
    const low=32000+i*2400,high=low+1000,target=low+500;
    add("extension","位值",i,"挑戰",`哪一個數正好在${zh(low)}和${zh(high)}的正中間？`,target,[target-100,target+100,low+50],`兩數相差1,000，一半是500；${zh(low)}＋500＝${zh(target)}。`,"先求兩個端點相差多少，再取一半。");
    const start=2200+i*180,change=450+i*30,end=start+change,answer=end-change;
    add("extension","加減",i,"挑戰",`一個數增加${change}後變成${end}，原來的數是多少？`,answer,[answer+change,answer-change,end+change],`逆推時用${end}－${change}＝${answer}。`,"增加後要回到原數，使用相反的運算。");
    const x=48+i*6,y=5+(i%3),prod=x*y,half=prod/2;
    add("extension","乘法",i,"挑戰",`${x}×${y}的答案再除以2，結果是多少？`,half,[prod,half+y,half-y],`先算${x}×${y}＝${prod}，再算${prod}÷2＝${half}。`,"分成兩步；第二步是在找第一步答案的一半。");
    const groups=7+i,each=13+i,total=groups*each,remove=each*2,leftGroups=groups-2;
    add("extension","除法",i,"挑戰",`${total}個物品每${each}個分一組。拿走2組後，還剩幾組？`,leftGroups,[groups,groups-1,leftGroups+2],`${total}÷${each}＝${groups}組，拿走2組後剩${leftGroups}組。`,"先求原本可以分成幾組，再處理拿走的組數。","組");
    const a=296+i*38,b=411+i*42,estimate=Math.round(a/100)*100+Math.round(b/100)*100;
    add("extension","估算",i,"挑戰",`把${a}和${b}都估成最接近的整百，兩數的和約是多少？`,estimate,[estimate-100,estimate+100,a+b],`${a}約是${Math.round(a/100)*100}，${b}約是${Math.round(b/100)*100}，合計約${estimate}。`,"兩個數要分別估，再相加。");
    const buses=3+i,seats=32+i*2,students=buses*seats-7,left=7;
    add("extension","應用",i,"挑戰",`${buses}輛車每輛可坐${seats}人，安排${students}位學生後，總共還有幾個空位？`,left,[left+buses,seats-left,buses*seats],`總座位${buses}×${seats}＝${buses*seats}，再減${students}，剩${left}個。`,"先算全部座位，再和學生人數比較。","個");
  }

  /* ===== 數感直覺擴充題（id 由 06 起，避免與上方 01–05 撞號） =====
     設計原則：用既有六單元承載「數感」——湊整、拆解、心算策略、
     合理性判斷、逆推與多步驟。挑戰題比例刻意提高，同時強化計算。 */

  // 基礎補強＋：湊整與心算的入門版（難度：標準）
  for(let i=1;i<=2;i++){
    const n=3508+i*1200, hundreds=Math.floor(n/100);
    add("foundation","位值",i+5,"標準",`${zh(n)}裡面一共有幾個「百」？`,hundreds,[Math.floor(n/1000),hundreds*10,n%100],`${zh(n)}＝${hundreds}個百又${n%100}，所以有${hundreds}個百。`,"把百位以上的數字一起看成幾個百。");
    const a=47+i*8, b=37+i*5, ans=a+b, near=Math.ceil(a/10)*10, addup=near-a;
    add("foundation","加減",i+5,"標準",`用湊整算${a}＋${b}：先把${a}補成${near}，再算下去，答案是多少？`,ans,[ans-addup,ans+10,ans-10],`${a}＋${addup}＝${near}，再加剩下的${b-addup}，得到${ans}。`,"先補到整十，記得把多補的部分從另一個數扣回來。");
    const k=8+i*4, prod=25*k;
    add("foundation","乘法",i+5,"標準",`25×${k}＝？（提示：25×4＝100）`,prod,[prod-25,prod+25,25+k],`每4個25就是100，${k}裡有${k/4}個4，所以25×${k}＝100×${k/4}＝${prod}。`,"把25湊成整百：先數有幾組4。");
    const per=25, people=4+i, total=per*people;
    add("foundation","除法",i+5,"標準",`${total}元，每人分${per}元，可以分給幾人？`,people,[people-1,people+1,total-per],`${total}÷${per}＝${people}；每4人剛好用掉100元，比較好數。`,"用25湊整：每4個25是100，先看有幾個100。");
    const price=39+i*10, qty=5, real=price*qty, est=Math.round(price/10)*10*qty;
    add("foundation","估算",i+5,"標準",`一個${price}元，買${qty}個。先估算，大約要準備多少錢比較保險？`,est,[est-50,real,est+100],`${price}約${Math.round(price/10)*10}，×${qty}約${est}元（精算是${real}元）。`,"先把單價估成最接近的整十，再乘數量。","元");
    const perBox=10, items=42+i*7, boxes=Math.ceil(items/perBox);
    add("foundation","應用",i+5,"標準",`${items}顆蛋，每盒最多裝${perBox}顆，至少要幾個盒子才裝得下？`,boxes,[Math.floor(items/perBox),boxes+1,items-perBox],`${Math.floor(items/perBox)}盒只能裝${Math.floor(items/perBox)*perBox}顆，剩下的還要再一盒，所以要${boxes}盒。`,"裝不滿也要多準備一個盒子。","個");
  }

  // 四年級共學＋：數感核心（前2題標準、後3題挑戰）
  for(let i=1;i<=5;i++){
    const diff=i<=2?"標準":"挑戰";
    const n=20000+i*3100+i*40, nearK=Math.round(n/1000)*1000;
    add("common","位值",i+5,diff,`${zh(n)}最接近哪一個整千？`,nearK,[nearK-1000,nearK+1000,Math.round(n/100)*100],`看百位決定千位：${zh(n)}最接近${zh(nearK)}。`,"百位到達5百就進到下一個千。");
    const a=1980+i*3, b=2568+i*40, ans=a+b, comp=2000-a;
    add("common","加減",i+5,diff,`用湊整算${zh(a)}＋${zh(b)}：把${zh(a)}先當成2000來算，答案是多少？`,ans,[ans+comp,ans-comp,a+b-100],`${zh(a)}＝2000－${comp}，${zh(b)}＋2000＝${zh(b+2000)}，再減${comp}得${zh(ans)}。`,"接近整千的數先當整千算，最後補回差額。");
    const x=91+i, y=6+i, prod=x*y, gap=100-x;
    add("common","乘法",i+5,diff,`用拆解法算${x}×${y}：先算100×${y}再扣掉，${x}×${y}＝？`,prod,[100*y,prod-y,prod+y],`100×${y}＝${100*y}，再減${gap}×${y}＝${gap*y}，得${prod}。`,"接近整百的數，先用整百乘，再扣掉多算的部分。");
    const divisor=6+i, quot=48+i*5, total=divisor*quot;
    add("common","除法",i+5,diff,`${zh(total)}÷${divisor}＝？（可先估：${divisor}×50＝${divisor*50}）`,quot,[quot+10,quot-10,Math.round(total/(divisor+1))],`${divisor}×50＝${divisor*50}，再微調到${divisor}×${quot}＝${zh(total)}，所以商是${quot}。`,"先用整十估出商大概多少，再往上或往下調。");
    const p=312+i*47, r=489+i*38, exact=p+r, est=Math.round(p/100)*100+Math.round(r/100)*100;
    add("common","估算",i+5,diff,`不必精算，${p}＋${r}最接近下面哪一個數？`,est,[est-100,est+100,est-200],`${p}約${Math.round(p/100)*100}，${r}約${Math.round(r/100)*100}，和約${est}（精算是${exact}）。`,"把每個數都估成最接近的整百，再相加。");
    const price=105+i*12, qty=5, total2=price*qty, paid=1000, change=paid-total2;
    add("common","應用",i+5,diff,`一個${price}元，買${qty}個，付${zh(paid)}元，應找回多少元？`,change,[paid-price,total2,change-100],`共${price}×${qty}＝${total2}元，${zh(paid)}－${total2}＝${change}元。`,"先算總價，再用付的錢減總價。","元");
  }

  // 進階延伸＋：逆推、多步驟與心算策略（難度：挑戰）
  for(let i=1;i<=3;i++){
    const thousands=6+i, hundreds=thousands-3, n=thousands*1000+hundreds*100;
    add("extension","位值",i+5,"挑戰",`一個四位數：千位是${thousands}，百位比千位少3，十位和個位都是0。這個數是多少？`,n,[thousands*1000+hundreds*10,thousands*1000,thousands*1000+hundreds*1000],`千位${thousands}是${zh(thousands*1000)}，百位${hundreds}是${hundreds*100}，合起來${zh(n)}。`,"一位一位定位，再把各位的值加起來。");
    const start=3000+i*250, spent=680+i*40, got=350+i*20, end=start-spent+got;
    add("extension","加減",i+5,"挑戰",`帳戶原有${zh(start)}元，先花掉${zh(spent)}元，又存入${zh(got)}元，現在有多少元？`,end,[start-spent-got,start+spent+got,end-100],`${zh(start)}－${zh(spent)}＝${zh(start-spent)}，再＋${zh(got)}＝${zh(end)}。`,"照順序做兩步：先減再加。","元");
    const x=24+i*3, y=15+i, prod=x*y, doubled=prod*2;
    add("extension","乘法",i+5,"挑戰",`${x}×${y}的積再乘2，等於多少？`,doubled,[prod,doubled-x,doubled+y],`先算${x}×${y}＝${prod}，再×2＝${doubled}；也可想成${x}×${y*2}。`,"兩步：先乘出積，第二步再乘2（或把其中一個數變兩倍）。");
    const divisor=7+i, quot=23+i*4, rem=(i*2)%divisor+1, total=divisor*quot+rem;
    add("extension","除法",i+5,"挑戰",`${zh(total)}顆糖每${divisor}顆裝一包，最多可以裝滿幾包？`,quot,[quot+1,quot-1,rem],`${zh(total)}÷${divisor}＝${quot}餘${rem}，餘下的${rem}顆不夠一包，所以裝滿${quot}包。`,"裝滿才算一包，餘數不足一包不能算進去。","包");
    const per=213+i*15, qty=6+i, exact=per*qty, roundPer=Math.round(per/100)*100, est=roundPer*qty;
    add("extension","估算",i+5,"挑戰",`一箱${per}元，買${qty}箱。用估算判斷大約要準備多少錢（先把單價估成整百）？`,est,[exact,est+qty*100,est-qty*100],`${per}約${roundPer}，${roundPer}×${qty}＝${est}元；這是估算值，精算是${exact}元。`,"先把單價估成最接近的整百再乘；估算不必等於精算。","元");
    const boxes=6+i, per2=48+i*4, remain=30+i*10, sold=per2*boxes-remain;
    add("extension","應用",i+5,"挑戰",`倉庫有${boxes}箱貨，每箱${per2}件。賣出一些後還剩${remain}件，請問賣出了幾件？`,sold,[per2*boxes,remain,sold-remain],`總共${per2}×${boxes}＝${per2*boxes}件，減去剩下的${remain}件，賣出${sold}件。`,"先算總數，再減掉剩下的，就是賣出的。","件");
  }

  if(typeof window!=="undefined") window.MATH_QUESTION_BANK=bank;
  if(typeof module!=="undefined"&&module.exports) module.exports=bank;
})();
