/* Config */
import { Config } from './../config/app.config';

export function augmentColumnWithNDNodes(col, seenNodes, _overrideStandard, parentNodes) {
  //if(col.length === 0 || col.length > 5) return;

  var newCol = [];
  col.forEach((c,i) => {
    var nds = nodes[c].nd_edge.filter(n => parentNodes[n.id] && !seenNodes[n.id]).map(n => n.id);
    var first_half = nds.slice(0, nds.length/2);
    var second_half = nds.slice(nds.length/2);
    newCol = newCol.concat(first_half, [c], second_half)
    first_half.forEach(n => seenNodes[n] = 1);
    second_half.forEach(n => seenNodes[n] = 1);
  });

  return newCol;

}

export function layoutSubGraph(parentNodes, _root, degrees, _overrideStandard) {
  var columns = [];
  var nColumns = 1 + degrees * 2;
  for (var i = 0; i < nColumns; i++) columns[i] = [];
  var mid = Math.floor(nColumns / 2);

  var root = _root.replace(/^(.*?)\.[ABC](\..+)?$/, '$1$2');
  let getDomainByStandard = function(_standard) {
    let cluster_id = _standard ? nodes[_standard].ccmathcluster_id: null;
    let cluster = {};
    cluster = _.map(window.cc.clusters, function(c) {
      if (c.id === cluster_id) return c;
    });
    cluster = _.without(cluster, undefined);
    let _domain = _.find(window.cc.domains, (d) => d.id === cluster[0].ccmathdomain_id);
    return _domain;
  }

  let _getDomain = getDomainByStandard(root);

  var seenNodes = {};

  columns[mid] = [nodes[root].id];

  _(columns[mid]).forEach((v) => { seenNodes[v] = 1; }).value();

  //var nodeSort = (n) => require('./standards-utils').standardCode(n).replace('K.', '0.');
  if (_getDomain && _getDomain.grade && _getDomain.grade === 'HS') {
    // Keep on child standards
    columns[mid - 1] = _(nodes[root].rev_edge).map((n) => n.id).filter((n) => !seenNodes[n]).value();
    columns[mid + 1] = _(nodes[root].edge).map((n) => n.id).filter((n) => !seenNodes[n]).value();
  } else {
    columns[mid - 1] = _(nodes[root].rev_edge).map((n) => n.id).filter((n) => {
      let isHS = false;
      if (!parentNodes[n]) {
        let domain = window.cc.clusters[nodes[n].ccmathcluster_id].ccmathdomain_id;
        let grade = window.cc.domains[domain].grade;
        if (grade && grade === 'HS') {
          isHS = true;
        }
      }
      if (isHS) {
        return !seenNodes[n];
      }
      return parentNodes[n] && !seenNodes[n];
    }).value();
    columns[mid + 1] = _(nodes[root].edge).map((n) => n.id).filter((n) => {
      let isHS = false;
      if (!parentNodes[n]) {
        let domain = window.cc.clusters[nodes[n].ccmathcluster_id].ccmathdomain_id;
        let grade = window.cc.domains[domain].grade;
        if (grade && grade === 'HS') {
          isHS = true;
        }
      }
      if (isHS) {
        return !seenNodes[n];
      }
      return parentNodes[n] && !seenNodes[n];
    }).value();
  }
  

  _(columns[mid - 1]).forEach((v) => { seenNodes[v] = 1; }).value();

  _(columns[mid + 1]).forEach((v) => { seenNodes[v] = 1; }).value();

  if (degrees === 2) {
    
    if (_getDomain && _getDomain.grade && _getDomain.grade === 'HS') {
      // Keep on child standards
      columns[mid - 2] = _(columns[mid - 1]).map((n) => _(nodes[n].rev_edge).map((n) => n.id).filter((n) => !seenNodes[n]).value().slice(/*0,3*/)).flatten().unique().value();
      columns[mid + 2] = _(columns[mid + 1]).map((n) => _(nodes[n].edge).map((n) => n.id).filter((n) => !seenNodes[n]).value().slice(/*0,3*/)).flatten().unique().value();
    } else {
      columns[mid - 2] = _(columns[mid - 1]).map((n) => _(nodes[n].rev_edge).map((n) => n.id).filter((n) => {
        let isHS = false;
        if (!parentNodes[n]) {
          let domain = window.cc.clusters[nodes[n].ccmathcluster_id].ccmathdomain_id;
          let grade = window.cc.domains[domain].grade;
          if (grade && grade === 'HS') {
            isHS = true;
          }
        }
        if (isHS) {
          return !seenNodes[n];
        }
        return !seenNodes[n] && parentNodes[n];
      }).value().slice(/*0,3*/)).flatten().unique().value();
      columns[mid + 2] = _(columns[mid + 1]).map((n) => _(nodes[n].edge).map((n) => n.id).filter((n) => {
        let isHS = false;
        if (!parentNodes[n]) {
          let domain = window.cc.clusters[nodes[n].ccmathcluster_id].ccmathdomain_id;
          let grade = window.cc.domains[domain].grade;
          if (grade && grade === 'HS') {
            isHS = true;
          }
        }
        if (isHS) {
          return !seenNodes[n];
        }
        return !seenNodes[n] && parentNodes[n];
      }).value().slice(/*0,3*/)).flatten().unique().value();
    }
  }
  _(columns[mid - 2]).forEach((v) => { seenNodes[v] = 1; }).value();

  _(columns[mid + 2]).forEach((v) => { seenNodes[v] = 1; }).value();


  return columns.map((c, i) => (i > 0 && i < 4) ? augmentColumnWithNDNodes(c, seenNodes, _overrideStandard, parentNodes) : c);
}

export function collapseHeight(s) {
  var lines = Math.ceil(s.desc.replace(/(<([^>]+)>)/ig, '').length / 70);
  var hasChild = _(window.cc.standards).pick((x) => x.ccmathcluster_id === s.ccmathcluster_id && x.ordinal.indexOf(s.ordinal + '.') === 0).values().value().length > 0;
  // console.log('hasChild => ', hasChild);
  if (lines < 5) {
    return 128 + 24 * lines + (hasChild ? 100 : 0);
  }
  lines = Math.min(lines, 4);
  return 128 + 24 * lines;
};

export function displayCourseResultsMethodology(value) {
  value = value||0;
  let rs = [];
  for (var key in Config.course_results_methodology) {
    if (!Config.course_results_methodology.hasOwnProperty(key)) continue;

    var obj = Config.course_results_methodology[key];
    if (obj.from && obj.to && value >= obj.from && value <= obj.to) {
      rs.push(obj);
    } else if(obj.from && !obj.to && value >= obj.from) {
      rs.push(obj);
    } else if (obj.to && !obj.from && value <= obj.to) {
      rs.push(obj);
    }
  }
  return rs[0] ? rs[0] : '';
}