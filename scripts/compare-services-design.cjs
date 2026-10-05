const sharp = require('sharp');
const dir='docs/services-design-2026-10-06';
const mode=process.argv[2]||'after';
const reference='docs/AXEONご支援内容 モバイル3画面ボード-2.png';
(async()=>{
  for(const [name,left,width] of [['top',99,408],['middle',564,408],['bottom',1032,407]]) {
    const ref=await sharp(reference).extract({left,top:55,width,height:969}).resize({width:390}).png().toBuffer();
    await sharp(ref).toFile(`${dir}/reference-sp-${name}.png`);
    await sharp({create:{width:780,height:929,channels:3,background:'#fff'}}).composite([
      {input:ref,left:0,top:0}, {input:`${dir}/${mode}-sp-${name}.png`,left:390,top:0}
    ]).png().toFile(`${dir}/${mode}-comparison-sp-${name}.png`);
  }
  const ref='docs/AXEON ご支援内容：コンサルティングと半内製化-1.png';
  const metadata=await sharp(`${dir}/${mode}-1122-full.png`).metadata();
  await sharp({create:{width:2244,height:Math.max(1402,metadata.height),channels:3,background:'#fff'}}).composite([
    {input:ref,left:0,top:0},{input:`${dir}/${mode}-1122-full.png`,left:1122,top:0}
  ]).png().toFile(`${dir}/${mode}-comparison-pc.png`);
})();
