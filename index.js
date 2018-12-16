module.exports = loadStyles;

/**
 * Injects the CSS into the <head> DOM node.
 *
 * @param {String} css CSS string to add to the <style> tag.
 * @param {String} id Use this id to clear and reload styles on hot-reload
 * @param {Document} doc (optional) document instance to use.
 */

function loadStyles(css, id, doc) {
  // default to the global `document` object
  if (!doc) doc = document;

  let sheet = doc.getElementById(id);

  if (!sheet) {
    sheet = createSheet(id, doc);
  } else {
    clearRules(sheet.sheet);
    console.log("Cleared", sheet, sheet.sheet.cssRules)
  }

  // Really need to use a parser for this, but here's an MVP. Will fail if rules contain "}" (for, like, content or urls I guess?)
  const re = /[^{}]+{(([^{}]+)|((([^{}]+){([^{}]*)})+[^{}]*))}/g;
  accum = [];
  do {
    var r = re.exec(css);
    if (!r || !r[0].trim()) continue;
    accum.push(r[0])
  } while(r);
  accum.reverse().forEach(r => sheet.sheet.insertRule(r));

  return sheet;
}

function createSheet(id, doc) {
  var head = doc.head || doc.getElementsByTagName('head')[0];

  // no <head> node? create one...
  if (!head) {
    head = doc.createElement('head');
    var body = doc.body || doc.getElementsByTagName('body')[0];
    if (body) {
      body.parentNode.insertBefore(head, body);
    } else {
      doc.documentElement.appendChild(head);
    }
  }

  var style = doc.createElement('style');
  head.appendChild(style);
  style.type = 'text/css';
  console.log("creating new sheet");
  style.setAttribute("id", id);
  return style
}

function clearRules(sheet) {
  while(sheet.cssRules.length) {
    sheet.deleteRule(0);
  }
}