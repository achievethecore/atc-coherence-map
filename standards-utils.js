export function standardCode(sid) {
    var s = window.cc.standards[sid];
    var c = window.cc.clusters[s.ccmathcluster_id];
    var d = window.cc.domains[c.ccmathdomain_id];
    return [domainCode(d), c.ordinal, s.ordinal].join('.');
}

function domainCode(d) {
    return (d.grade + '.' + d.ordinal).trim();
}


export function formatHTML(desc) {
  var $desc = $('<div>'+desc+'</div>');
  if($desc.find('p').length === 0) return desc; // plaintext or empty
  $desc.find('a[name][id]').each( function() { this.href = "javascript:showTip(\'"+this.innerHTML+'\',\''+this.id.replace('\'','\\\'')+"\')"; });
  return $desc.find('p').map((i,p) => $(p).html()).get().join('<br />'); // html-editor
}
