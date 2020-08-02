'use strict'
define(function(require) {
  let parseExpression = require('player/parse-expression')
  let vars = require('vars')

  vars['drop4_4'] = parseExpression('[1,0]t[4,4]')
  vars['drop6_2'] = parseExpression('[1,0]t[6,2]')
  vars['drop7_1'] = parseExpression('[1,0]t[7,1]')
  vars['drop8_8'] = parseExpression('[1,0]t[8,8]')
  vars['drop12_4'] = parseExpression('[1,0]t[12,4]')
  vars['drop14_2'] = parseExpression('[1,0]t[14,2]')
  vars['drop15_1'] = parseExpression('[1,0]t[15,1]')
  vars['drop16_16'] = parseExpression('[1,0]t[16,16]')
  vars['drop24_8'] = parseExpression('[1,0]t[24,8]')
  vars['drop28_4'] = parseExpression('[1,0]t[28,4]')
  vars['drop30_2'] = parseExpression('[1,0]t[30,2]')
  vars['drop31_1'] = parseExpression('[1,0]t[31,1]')
  vars['drop32_32'] = parseExpression('[1,0]t[32,32]')
  vars['drop56_8'] = parseExpression('[1,0]t[56,8]')
  vars['drop60_4'] = parseExpression('[1,0]t[60,4]')
  vars['drop62_2'] = parseExpression('[1,0]t[62,2]')
  vars['drop63_1'] = parseExpression('[1,0]t[63,1]')

  vars['tile_full'] = parseExpression('{x:0,y:0,w:1,h:1}')
  vars['tile_tl'] = parseExpression('{x:0,y:0,w:1/2,h:1/2}')
  vars['tile_tr'] = parseExpression('{x:1/2,y:0,w:1/2,h:1/2}')
  vars['tile_bl'] = parseExpression('{x:0,y:1/2,w:1/2,h:1/2}')
  vars['tile_br'] = parseExpression('{x:1/2,y:1/2,w:1/2,h:1/2}')
  vars['tile_m'] = parseExpression('{x:1/4,y:1/4,w:1/2,h:1/2}')
  vars['tile_h1'] = parseExpression('{x:0,y:0/5,w:1,h:1/5}')
  vars['tile_h2'] = parseExpression('{x:0,y:1/5,w:1,h:1/5}')
  vars['tile_h3'] = parseExpression('{x:0,y:2/5,w:1,h:1/5}')
  vars['tile_h4'] = parseExpression('{x:0,y:3/5,w:1,h:1/5}')
  vars['tile_h5'] = parseExpression('{x:0,y:4/5,w:1,h:1/5}')
  vars['tile_v1'] = parseExpression('{x:0/5,y:0,w:1/5,h:1}')
  vars['tile_v2'] = parseExpression('{x:1/5,y:0,w:1/5,h:1}')
  vars['tile_v3'] = parseExpression('{x:2/5,y:0,w:1/5,h:1}')
  vars['tile_v4'] = parseExpression('{x:3/5,y:0,w:1/5,h:1}')
  vars['tile_v5'] = parseExpression('{x:4/5,y:0,w:1/5,h:1}')

  vars['transparent'] = parseExpression('{r:0,g:0,b:0,a:0}')
  vars['black'] = parseExpression('{r:0,g:0,b:0,a:1}')
  vars['darkgray'] = parseExpression('{r:0.2,g:0.2,b:0.2,a:1}')
  vars['gray'] = parseExpression('{r:0.4,g:0.4,b:0.4,a:1}')
  vars['lightgray'] = parseExpression('{r:0.8,g:0.8,b:0.8,a:1}')
  vars['white'] = parseExpression('{r:1,g:1,b:1,a:1}')
  vars['red'] = parseExpression('{r:1,g:0,b:0,a:1}')
  vars['orange'] = parseExpression('{r:1,g:0.3,b:0,a:1}')
  vars['yellow'] = parseExpression('{r:1,g:0.9,b:0,a:1}')
  vars['green'] = parseExpression('{r:0,g:0.8,b:0,a:1}')
  vars['blue'] = parseExpression('{r:0,g:0.6,b:1,a:1}')
  vars['indigo'] = parseExpression('{r:0,g:0,b:0.8,a:1}')
  vars['violet'] = parseExpression('{r:0.4,g:0,b:0.8,a:1}')
  vars['neonpink'] = parseExpression('{r:1,g:0,b:1,a:1}')
  vars['neongreen'] = parseExpression('{r:0,g:0.7,b:1,a:1}')
  vars['rainbow'] = parseExpression('{r:[0.8,0,0]l6,g:[0,0.7,0]l6,b:[0,0,1]l6,a:1}')
  vars['random'] = parseExpression('{r:[0:0.8]r,g:[0:0.7]r,b:[0.1:0.9]r,a:1}')
})
