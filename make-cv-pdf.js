#!/usr/bin/env node
/* make-cv-pdf.js — generates public/cv/CV-Alex-Rivera.pdf from src/site-data.json (zero deps) */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/site-data.json', 'utf8'));
const { meta, cv } = data;

// Helvetica core font widths (first 128 code points), in 1/1000 units
const W=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const wOf=(c,f)=>W[c.charCodeAt(0)||65]*f/1000;
const textWidth=(s,f)=>[...s].reduce((a,c)=>a+wOf(c,f),0);
const REPL=[[0x2014,'--'],[0x2013,'-'],[0x2019,"'"],[0x2018,"'"],[0x201C,'"'],[0x201D,'"'],[0x00B7,'|'],[0x2605,'*'],[0x2192,'->'],[0x2B07,'v']];
const clean=s=>{let o=String(s);for(const [cp,r] of REPL)o=o.split(String.fromCodePoint(cp)).join(r);return [...o].map(c=>c.codePointAt(0)<128?c:'').join('').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');};

let y=760; const L=60,R=555,PW=R-L; let ops=[];
function ensure(space){ if(y-space<50){ ops.push('BT /F2 11 Tf 1 0 0 1 '+L+' '+y+' Tm ('+clean(meta.title+' -- Curriculum Vitae (continued)')+') Tj ET'); y-=24; } }
function line(text,size,font,gap,color){ ensure(gap); if(color)ops.push(color+' rg'); ops.push('BT /'+font+' '+size+' Tf 1 0 0 1 '+L+' '+y+' Tm ('+clean(text)+') Tj ET'); if(color)ops.push('0 0 0 rg'); y-=gap; }
function wrap(text,size,font,gap){ let cur=''; for(const word of String(text).split(' ')){ const t=cur?cur+' '+word:word; if(textWidth(t,size)>PW&&cur){ line(cur,size,font,gap); cur=word; } else cur=t; } if(cur)line(cur,size,font,gap); }
function rule(){ ops.push('0.49 0.36 1 RG 0.8 w '+L+' '+y+' m '+R+' '+y+' l S'); y-=16; }
function heading(t,color){ y-=4; rule(); line(t.toUpperCase(),13,'F2',20,color); }

line(meta.title,20,'F3',26);
wrap(meta.tagline,10,'F1',15);
line('Pronouns: '+meta.pronouns+'   |   '+meta.location,10,'F1',15);
line([meta.email,'ORCID '+meta.orcid,'https://github.com/mathelatics'].join('   -   '),9,'F1',22);

heading('Appointments','0.49 0.36 1');
for(const p of cv.positions){ wrap(p.role+'  ('+p.period+')',11,'F2',15); wrap(p.org+'  -  '+p.detail,10,'F1',16); y-=4; }

heading('Honors & Awards','0.13 0.83 0.93');
for(const a of cv.awards){ wrap(a.year+'   '+a.name,10,'F1',16); }

heading('Professional Service','0.85 0.75 0.15');
for(const s of cv.service){ wrap('-  '+s,10,'F1',16); }

heading('Full Record Online','1 0.36 0.54');
wrap('Selected publications with DOIs, open-source projects, talks, teaching and mentoring record:',10,'F1',15);
wrap(meta.siteUrl+'cv.html  |  '+meta.siteUrl+'publications',10,'F2',18);
line('Last updated: '+meta.updated,9,'F1',14);

const content=ops.join('\n');
const objs=[];
objs[1]='<< /Type /Catalog /Pages 2 0 R >>';
objs[2]='<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
objs[3]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>';
objs[4]='<< /Length '+Buffer.byteLength(content)+' >>\nstream\n'+content+'\nendstream';
objs[5]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
objs[6]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
objs[7]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique >>';
let out='%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'; const xref=[];
for(let i=1;i<=7;i++){ xref[i]=Buffer.byteLength(out,'latin1'); out+=i+' 0 obj\n'+objs[i]+'\nendobj\n'; }
const xoff=Buffer.byteLength(out,'latin1');
out+='xref\n0 8\n0000000000 65535 f \n';
for(let i=1;i<=7;i++) out+=String(xref[i]).padStart(10,'0')+' 00000 n \n';
out+='trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n'+xoff+'\n%%EOF';
fs.mkdirSync('public/cv',{recursive:true});
fs.writeFileSync('public/cv/CV-Alex-Rivera.pdf',out,'latin1');
console.log('OK public/cv/CV-Alex-Rivera.pdf', Buffer.byteLength(out,'latin1'),'bytes');
