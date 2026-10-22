"""Render an edited, narrated walkthrough from actual acceptance screenshots."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, subprocess, textwrap, re
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'media'/'intermediate';out.mkdir(exist_ok=True)
regular='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def font(n,b=False):return ImageFont.truetype(bold if b else regular,n)
chapters=json.loads((ROOT/'media/narration.json').read_text())
shots=['ui-01-overview.png','ui-01-overview.png','ui-02-flagged.png','ui-03-historical.png','ui-04-anchored.png','ui-07-duplicate.png','ui-06-tampered.png','ui-09-method.png']
points=[['A reporting gap','Same meter + hour','One scoped record'],['UTC hourly CSV','Explicit assumptions','Visible review trail'],['Capacity violation','Repeated meter-hour','Entire batch blocked'],['OPSD / CoSSMic','40.719 kWh sample','Historical, processed'],['Review confirmation','Actual EVM transaction','Local session only'],['Changed value, same hour','24 occupied slots','Claim blocked'],['Original proof: passes','Edited reading: fails','Integrity is not truth'],['Open, reproducible code','No field pilot claimed','No certificates issued']]
subtitles=[];elapsed=0;clips=[]
def stamp(sec):
 ms=round(sec*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
for i,c in enumerate(chapters):
 ident=c['id'];txt=out/f'{ident}.txt';txt.write_text(c['text']);audio=out/f'{ident}.aiff'
 subprocess.run(['say','-v','Daniel','-r','142','-f',str(txt),'-o',str(audio)],check=True)
 dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(audio)]))+.6
 sentences=re.split(r'(?<=[.!?])\s+',c['text']);weights=[len(s.split()) for s in sentences];total=sum(weights);lst=[]
 for j,sentence in enumerate(sentences):
  im=Image.new('RGB',(1920,1080),'#0c1d25');d=ImageDraw.Draw(im)
  d.text((48,42),'PROOFGRID',font=font(30,True),fill='#c6f267');d.text((390,47),'IEEE ClimateChain 2026  /  Renewable Energy & Energy Trading',font=font(23),fill='#b8cbd1')
  d.text((48,170),f'{i+1:02} / 08',font=font(24),fill='#9bb1b9')
  y=228
  for line in textwrap.wrap(c['title'],18):d.text((48,y),line,font=font(36,True),fill='white');y+=46
  y+=42
  for p in points[i]:
   d.rectangle((48,y+8,54,y+14),fill='#c6f267')
   for line in textwrap.wrap(p,23):d.text((70,y),line,font=font(25),fill='#c0d0d4');y+=34
   y+=24
  shotname=shots[i]
  if i==6 and j<2:shotname='ui-05-verified.png'
  img=Image.open(ROOT/'evidence'/shotname).convert('RGB')
  
  # Zoom into the relevant application panel; retain original screenshots separately.
  if i in (1,2,3,4,5): img=img.crop((265,315,1260,min(img.height-40,1030)))
  elif i==6: img=img.crop((265,300,1260,min(img.height-35,800)))
  elif i==7: img=img.crop((265,300,1260,img.height-45))
  ratio=min(1440/img.width,760/img.height);img=img.resize((round(img.width*ratio),round(img.height*ratio)),Image.Resampling.LANCZOS)
  im.paste(img,(410+(1450-img.width)//2,135+(760-img.height)//2))
  d.rounded_rectangle((40,915,1880,1030),16,fill='#1b3540')
  for k,line in enumerate(textwrap.wrap(sentence,115)):d.text((70,937+k*33),line,font=font(28),fill='#f1f5f4')
  d.text((48,1050),'Edited walkthrough · actual local application screens · synthetic narration',font=font(16),fill='#8ca7b1')
  png=out/f'{ident}-{j}.png';im.save(png)
  length=dur*weights[j]/total
  lst += [f"file '{png.name}'",f'duration {length:.6f}']
  subtitles.append(f'{len(subtitles)+1}\n{stamp(elapsed)} --> {stamp(elapsed+length)}\n{sentence}\n');elapsed+=length
 lst.append(f"file '{png.name}'")
 manifest=out/f'{ident}.concat';manifest.write_text('\n'.join(lst))
 clip=out/f'{ident}.mp4'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(manifest),'-i',str(audio),'-vf','fps=24,format=yuv420p','-af','apad','-t',str(dur),'-c:v','libx264','-preset','veryfast','-crf','23','-c:a','aac','-b:a','128k',str(clip)],check=True)
 clips.append(f"file '{clip.name}'")
(out/'clips.concat').write_text('\n'.join(clips))
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(out/'clips.concat'),'-c','copy','-movflags','+faststart',str(ROOT/'media/ProofGrid-demo.mp4')],check=True)
(ROOT/'media/ProofGrid-demo.srt').write_text('\n'.join(subtitles))
print(json.dumps({'seconds':elapsed,'video':'media/ProofGrid-demo.mp4','chapters':len(chapters)}))
