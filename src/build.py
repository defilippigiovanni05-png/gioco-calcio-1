s=open('shell.html').read()
js='\n'.join(open(f).read() for f in ['data.js','engine.js','game.js','ui.js','match.js','ext.js','ext_ui.js'])
open('index.html','w').write(s.replace('/*SCRIPTS*/',js))
