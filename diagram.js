

function generateDot(def) {

  let nodedefs = '';

  for(let key in def) {

    // Node entry
    if(key === 'title') { continue; }

    let methods = def[key].methods;
    let members = def[key].members;
    let tablemarkup = '';
    let nmethods=0;
    if(methods) {

      for(let method in methods) {
        tablemarkup += '<TR>';
        if(nmethods === 0) {
          tablemarkup += `<TD PORT="cls" ROWSPAN="${Object.keys(methods).length}">${key}</TD>`;
        }
        tablemarkup += `<TD PORT="${method}">${method}</TD>\n`;
        tablemarkup += '</TR>';
        nmethods++;
      }
    } else {
      tablemarkup = `<TR><TD PORT="cls">${key}</TD></TR>`;
    }
    let label = `
<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="3">
${tablemarkup}
</TABLE>
`;

    nodedefs += `${key} [label=<${label}>];\n`;

    // Connections to other nodes
    if(members) {
      for(let member of members) {
        nodedefs += `${member}:cls -> ${key}:cls\n`;
      }
    }

  }

  return `
digraph ${def.title} {

node [
  shape = plaintext;
]
rankdir = BT;

${nodedefs}
}
  `;
}

let dot = generateDot({
  title : 'ZCanvas',
  ZCanvas : {
    members : [
      'Layer'
    ]
  },
  Layer : {
    members : [
      'Shape'
    ],
    methods : {
      addShape : {
        calls : []
      },
      removeShape : {}
    }
  },
  Shape : {}
});

console.log(dot);
