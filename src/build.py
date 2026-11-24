s=open('shell.html').read()
js='\n'.join(open(f).read() for f in ['data.js','engine.js','game.js','ui.js','match.js','ext.js','ext_ui.js','ext2.js','ext3.js','ext4.js','ext5.js','ext6.js','ext7.js'])
open('index.html','w').write(s.replace('/*SCRIPTS*/',js))
