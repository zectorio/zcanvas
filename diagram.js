

function generateDot(def) {

  let nodedefs = '';

  for(let key in def) {

    if(key === 'title') { continue; }

    let methods = def[key].methods;
    let methodrows = '';
    let nmethods=0;
    if(methods) {

      for(let method in methods) {
        methodrows += '<TR>';
        if(nmethods === 0) {
          methodrows += `<TD ROWSPAN="${Object.keys(methods).length}">${key}</TD>`;
        }
        methodrows += `<TD>${method}</TD>\n`;
        methodrows += '</TR>';
        nmethods++;
      }
    } else {
      methodrows = `<TR><TD>${key}</TD></TR>`;
    }
    let label = `
<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="3">
${methodrows}
</TABLE>
`;

    nodedefs += `${key} [label=<${label}>];\n`;
  }

  return `
digraph ${def.title} {

node [
  shape = plaintext;
]

${nodedefs}
}
  `;
}

let dot = generateDot({
  title : 'ZCanvas',
  ZCanvas : {
    contains : [
      'Layer(*)'
    ]
  },
  Layer : {
    methods : {
      addShape : {
        calls : []
      },
      removeShape : {}
    }
  }
});

console.log(dot);
