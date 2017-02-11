
const CLSCOLOR = 'lightgray';

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
          tablemarkup += `<TD PORT="cls" BGCOLOR="${CLSCOLOR}" ROWSPAN="${Object.keys(methods).length}">${key}</TD>`;
        }
        tablemarkup += `<TD PORT="${method}">${method}</TD>\n`;
        tablemarkup += '</TR>';
        nmethods++;
      }
    } else {
      tablemarkup = `<TR><TD PORT="cls" BGCOLOR="${CLSCOLOR}">${key}</TD></TR>`;
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
  fontsize = 12;
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
      'Layer',
      'Film',
      'PickCanvas'
    ],
    methods : {
      getLayer : {},
      createLayer : {}
    }
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
  Shape : {},
  Film : {},
  PickCanvas : {}
});

console.log(dot);
