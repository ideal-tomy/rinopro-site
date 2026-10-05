import fs from 'node:fs';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const dir='docs/ui-foundation-2026-10-05/';
const rows=[];
for(const name of ['375','390','430','1280','1440','services-consulting','prototype-showroom','services-insourcing-enablement']){
const a=JSON.parse(fs.readFileSync(dir+'before-'+name+'.json','utf8')),b=JSON.parse(fs.readFileSync(dir+'after-'+name+'.json','utf8'));
assert.deepEqual(b.elements,a.elements,name+' geometry/text/links');assert.equal(b.scrollWidth,a.scrollWidth);assert.equal(b.clientWidth,a.clientWidth);assert.equal(b.overlay,false);assert.deepEqual(b.images,[]);
const pa=await sharp(dir+'before-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),pb=await sharp(dir+'after-'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.deepEqual(pa.info,pb.info,name+' dimensions');let changed=0,bands={};for(let y=0;y<pa.info.height;y++)for(let x=0;x<pa.info.width;x++){const i=(y*pa.info.width+x)*4;if(pa.data[i]!==pb.data[i]||pa.data[i+1]!==pb.data[i+1]||pa.data[i+2]!==pb.data[i+2]){changed++;const band=Math.floor(y/500)*500;bands[band]=(bands[band]||0)+1;}}
rows.push({name,elements:b.elements.length,geometryTextLinksEqual:true,overflowBefore:a.scrollWidth-a.clientWidth,overflowAfter:b.scrollWidth-b.clientWidth,changedPixels:changed,pixels:pa.info.width*pa.info.height,bands});
}
fs.writeFileSync(dir+'comparison.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows));
