/* 數感偵探社題庫：三條路徑各 30 題，共 90 題。 */
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

  if(typeof window!=="undefined") window.MATH_QUESTION_BANK=bank;
  if(typeof module!=="undefined"&&module.exports) module.exports=bank;
})();
