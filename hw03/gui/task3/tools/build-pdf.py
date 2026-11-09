from pathlib import Path
import json,html,re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,Image,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
root=Path(r'D:\Workspace\SoftwareTesting\HW03\eshop-sut-HW03\hw03\gui\task3');data=json.loads((root/'results.json').read_text(encoding='utf-8'))
pdfmetrics.registerFont(TTFont('Arial',r'C:\Windows\Fonts\arial.ttf'));pdfmetrics.registerFont(TTFont('Arial-Bold',r'C:\Windows\Fonts\arialbd.ttf'))
styles=getSampleStyleSheet()
for name in ['Normal','BodyText','Heading1','Heading2','Heading3','Title']:
 styles[name].fontName='Arial-Bold' if name in ['Heading1','Heading2','Heading3','Title'] else 'Arial';styles[name].leading=15
styles['Normal'].fontSize=10;styles['Normal'].spaceAfter=6
story=[]
for line in (root/'Task3_Report.md').read_text(encoding='utf-8').splitlines():
 if not line.strip():continue
 if line.startswith('|'):
  if line.startswith('| Browser'):
   cells=[['Browser','Pass','Fail','Blocked','Review','Total']]+[[p,44,26,14,38,122] for p in ['Chrome','Edge','Firefox']]+[['Total',132,78,42,114,366]]
   t=Table(cells,colWidths=[100,65,65,65,65,65]);t.setStyle(TableStyle([('FONTNAME',(0,0),(-1,-1),'Arial'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#17365D')),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.3,colors.lightgrey),('BOTTOMPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8)]));story += [t,Spacer(1,12)]
  continue
 style='Normal';text=line
 if line.startswith('# '):style='Title';text=line[2:]
 elif line.startswith('## '):style='Heading2';text=line[3:]
 text=re.sub(r'\[([^]]+)\]\(([^)]+)\)',r'\1 (\2)',text)
 story.append(Paragraph(html.escape(text),styles[style]))
story += [PageBreak(),Paragraph('Đối chiếu 19 nhóm findings',styles['Heading1'])]
for f in json.loads((root/'findings/mapping.json').read_text(encoding='utf-8')):
 story.append(Paragraph(html.escape(f['group']+' — '+f['title']),styles['Heading3']));story.append(Paragraph(html.escape(', '.join(f['caseIds'])+' | '+f['issue']),styles['Normal']));story.append(Paragraph(html.escape(str(f['task3Statuses'])),styles['Normal']))
for platform in ['chrome','edge','firefox']:
 r=next(r for r in data['records'] if r['platform']==platform and r['caseId']=='GUI-019');e=next(e for e in reversed(r['evidence']) if e['kind']!='screenshot');p=root/e['path'];from PIL import Image as PI
 width,height=PI.open(p).size
 story += [PageBreak(),Paragraph('Evidence mẫu — '+platform,styles['Heading1']),Paragraph('GUI-019: tìm tên đầy đủ. Ảnh thu từ lượt thực thi Task 3; ảnh Firefox có nhãn URL, không có thanh địa chỉ native.',styles['Normal']),Image(str(p),width=495,height=495*height/width),Paragraph(html.escape(e['path']),styles['Normal'])]
def footer(c,d):c.setFont('Arial',8);c.drawString(45,24,'HW03 Task 3 | Review pending | 10/11/2026');c.drawRightString(550,24,str(d.page))
SimpleDocTemplate(str(root/'Task3_Report.pdf'),pagesize=(595.28,841.89),rightMargin=45,leftMargin=45,topMargin=42,bottomMargin=42).build(story,onFirstPage=footer,onLaterPages=footer)
print('PDF exported')
