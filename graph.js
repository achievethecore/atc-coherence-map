var Component = require('react').Component;
var LayoutStyle = require('./style').LayoutStyle;
var classNames = require('classnames');
var shallowEqual = require('react/lib/shallowEqual');

var GraphNode = require('./graphnode');

const arrowPadding = 0.01;

const arrowBack = 0.985 - 0.967;

const cardRatioH = 0.5 * LayoutStyle.CardWidth / (LayoutStyle.CardWidth + LayoutStyle.PaddingH);


function makeSVGPointString(a) {
  return _.map(a, (p) => p.join(',')).join(' ');
}



function keyName(n) {
  return n.replace(/\./g, '-');
}

var flattenNDNodes = (g) => g.map( (c) => c.map( (n) => n[0]==='n'?n[1]:n ) );

var isParentStandard = (n) => {
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
  let domain = getDomainByStandard(n.id);
  if (domain.grade !== 'HS') {
    return n.ordinal.indexOf('.') === -1;
  } else {
    return true;
    // return n.ordinal.indexOf('.') !== -1;
  }
};

function augmentColumnWithNDNodes_OLD(col, seenNodes, _overrideStandard) {
    if(col.length === 0 || col.length > 5) return;
    var first = nodes[col[0]];
    var last = nodes[col[col.length-1]];

    if(first.nd_edge.filter(isParentStandard).length >= 1 ) { // adding node on top
      col.unshift(['n', first.nd_edge.filter(isParentStandard)[0].id]);
      col.push(['n', null]); // ... with either space on the bottom
      if(first.nd_edge.filter(isParentStandard).length >= 2 && first === last) {
        if( last.nd_edge.filter(isParentStandard).length >= 2 && last.nd_edge.filter(isParentStandard).filter((n) => n.id === _overrideStandard).length > 0 ) {
          col[col.length-1][1] = _overrideStandard; // or the second (selected) edge
        }
        else {
          col[col.length-1][1] = first.nd_edge.filter(isParentStandard)[1].id; // or the second edge
        }
      }
      else if(last.nd_edge.filter(isParentStandard).length >= 1 && first !== last) {
        col[col.length-1][1] = last.nd_edge.filter(isParentStandard)[0].id; // or a bottom node
      }
    }
    else if(last.nd_edge.filter(isParentStandard).length >= 1) { // only a bottom node
      col.unshift(['n', null]);
      col.push(['n', last.nd_edge.filter(isParentStandard)[0].id]);
    }
}

function augmentColumnWithNDNodes(col, seenNodes, _overrideStandard) {
    //if(col.length === 0 || col.length > 5) return;

    var newCol = [];
    col.forEach((c,i) => {
      // var nds = nodes[c].nd_edge.filter(n => !seenNodes[n.id]).map(n => n.id);
      var nds = nodes[c].nd_edge.filter(n => {
        let domain = window.cc.clusters[nodes[n.id].ccmathcluster_id].ccmathdomain_id;
        let grade = window.cc.domains[domain].grade;
        if (grade && grade === 'HS') {
          return !seenNodes[n.id];
        } else {
          return parentNodes[n.id] && !seenNodes[n.id];
        }
      }).map(n => n.id);

      var first_half = nds.slice(0, nds.length/2);
      var second_half = nds.slice(nds.length/2);
      newCol = newCol.concat(first_half, [c], second_half)
      first_half.forEach(n => seenNodes[n] = 1);
      second_half.forEach(n => seenNodes[n] = 1);
    });

    return newCol;

}

function calculateWidths(subgraph, detailLayout = false) {
  var widths = [];
  for(var i=0;i<subgraph.length - 1;i++) {
    var edge_count = 0;
    for(var id of subgraph[i]) {
      if(id)
        edge_count += nodes[id].edge.concat(nodes[id].nd_edge).filter( edge => subgraph[i+1].indexOf(edge.id) > -1 ).length;
    }
    // same-column edges
    for(var id of subgraph[i + 1]) {
      if(id)
        edge_count += nodes[id].edge.filter( edge => subgraph[i + 1].indexOf(edge.id) > -1 ).length;
    }
    // same-column ND edges EXCEPT adjacent ones since they don't take up space
    for(var j=0;j<subgraph[i + 1].length;j++) {
      var id = subgraph[i + 1][j];
      if(id)
        edge_count += nodes[id].nd_edge.filter( edge => subgraph[i + 1].indexOf(edge.id) > j + 1 ).length;
    }
    if (detailLayout && (edge_count < 20 || edge_count === 30 || edge_count === 24)) edge_count = 1;
    widths[i] = Math.min(1.75,Math.max(1, 1.0/8.0 * edge_count));
    widths[i] *= Math.floor(292 * widths[i]/10)*10 / (292 * widths[i]);
    console.log(edge_count);
  }
  return widths;
}

var layoutSubGraph = function(_root, degrees, _overrideStandard) {
  var columns = [];
  var nColumns = 1 + degrees*2;
  for(var i = 0; i < nColumns; i++) columns[i] = [];
  var mid = Math.floor(nColumns/2);

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

  _(columns[mid]).forEach((v) => {seenNodes[v]=1;}).value();

  //var nodeSort = (n) => require('./standards-utils').standardCode(n).replace('K.', '0.');
  if (_getDomain && _getDomain.grade && _getDomain.grade === 'HS') {
    // Keep on child standard's connection but not exists parent standard
    columns[mid - 1] = _(nodes[root].rev_edge).map( (n) => n.id ).filter((n) => !seenNodes[n]).value();
    columns[mid + 1] = _(nodes[root].edge).map( (n) => n.id ).filter((n) => !seenNodes[n]).value();

  } else {
    columns[mid - 1] = _(nodes[root].rev_edge).map( (n) => n.id ).filter((n) => {
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
      return parentNodes[n] && !seenNodes[n]
    }).value();
    columns[mid + 1] = _(nodes[root].edge).map( (n) => n.id ).filter((n) => {
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
  
  _(columns[mid - 1]).forEach((v) => {seenNodes[v]=1;}).value();

  _(columns[mid + 1]).forEach((v) => {seenNodes[v]=1;}).value();

  if(degrees === 2) {
    if (_getDomain && _getDomain.grade && _getDomain.grade === 'HS') {
      // Keep on child standard's connection but not exists parent standard
      columns[mid - 2] = _(columns[mid - 1]).map( (n) => _(nodes[n].rev_edge).map( (n) => n.id ).filter((n) => !seenNodes[n]).value().slice(/*0,3*/) ).flatten().unique().value();
      columns[mid + 2] = _(columns[mid + 1]).map( (n) => _(nodes[n].edge).map( (n) => n.id ).filter((n) => !seenNodes[n]).value().slice(/*0,3*/) ).flatten().unique().value();
    } else {
      columns[mid - 2] = _(columns[mid - 1]).map( (n) => _(nodes[n].rev_edge).map( (n) => n.id ).filter((n) => {
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
      }).value().slice(/*0,3*/) ).flatten().unique().value();
      columns[mid + 2] = _(columns[mid + 1]).map( (n) => _(nodes[n].edge).map( (n) => n.id ).filter((n) => {
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
      }).value().slice(/*0,3*/) ).flatten().unique().value();
    }
  }
  _(columns[mid - 2]).forEach((v) => {seenNodes[v]=1;}).value();

  _(columns[mid + 2]).forEach((v) => {seenNodes[v]=1;}).value();


  return columns.map((c, i) => (i > 0 && i < 4) ? augmentColumnWithNDNodes(c, seenNodes, _overrideStandard) : c);
};


export default class Graph extends Component {
  static propTypes = {
    detailLayout: React.PropTypes.bool.isRequired,
    root: React.PropTypes.string.isRequired,
    standard: React.PropTypes.string,
    standard_index: React.PropTypes.number,
    onAdjustParentHeight: React.PropTypes.func.isRequired,
    onViewStandard: React.PropTypes.func.isRequired,
    onMapStandard: React.PropTypes.func.isRequired,
    panTo: React.PropTypes.func.isRequired,
  };

  state = {highlight: null}

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  _getNodeSubgraphIndexes(subgraph, standard, standard_index) {
    var c = standard_index||1;
    if(c === null) return [Math.floor(subgraph.length / 2), Math.floor(subgraph[Math.floor(subgraph.length / 2)].length / 2)]; // return center node by default
    for(var i=0;i<subgraph.length;i++)
      for(var j=0;j<subgraph[i].length;j++) {
        if(parseInt(subgraph[i][j]) === parseInt(standard)) c--;
        if(c === 0) { return [i,j]; }
      }
    return [-1, -1];
  }

  panToStandard(nextProps) {
    if (window && window.disableScrollTop) {
      return;
    }
    window.onresize = null;
    if(!nextProps.root) return;
    if(!nextProps.standard) return;

    var subgraph = layoutSubGraph(nextProps.root, 2, nextProps.standard);

    subgraph = flattenNDNodes(subgraph);
    // remove current node's ND from the graph
    var node_nds = nodes[nextProps.standard].nd_edge.map(n => n.id);
    subgraph = subgraph.map(col => col.filter(n_id => node_nds.indexOf(n_id) === -1));
    var [focusedNode_i, focusedNode_j] = this._getNodeSubgraphIndexes(subgraph, nextProps.standard, nextProps.standard_index);

    // insert ND spacer above focused
    subgraph[focusedNode_i].splice(focusedNode_j, 0, null);
    focusedNode_j++;

    var focusedNode_x = focusedNode_i - (subgraph.length-1)/2;
    var focusedNode_y = focusedNode_j - (subgraph[focusedNode_i].length-1)/2;

    var widths = calculateWidths(subgraph);

    var expandColumns = function(x) {
        if(x > 1) x = (x - 1)*widths[3] + widths[2];
        else if(x < -1) x = (x - -1)*widths[0] - widths[1];
        else if(x > 0) x = x*widths[2];
        else if(x < 0) x = x*widths[1];
        return x;
    };

    if(focusedNode_x !== undefined) focusedNode_x = expandColumns(focusedNode_x);


    var topMode = 0; //(focusedNode_j === 0 || (focusedNode_j === 1 && subgraph[focusedNode_i][0] === null));
    var NDMode = ((/*focusedNode_j === 1 && subgraph[focusedNode_i][0] !== null && */ nodes[subgraph[focusedNode_i][focusedNode_j]].nd_edge.filter(isParentStandard).length));

    setTimeout(() => $(document).trigger('showZoomModal'), 401);

    // keep 40px from top if at the top (breaks arrow)
    if(!NDMode) {
      let f_y = focusedNode_y;
      window.onresize = () => { var focusedNode_y = f_y + (0.5*window.innerHeight/172 - 220/172 - 100/172); this.props.panTo(focusedNode_x, focusedNode_y, true); };
      focusedNode_y += (0.5*window.innerHeight/172 - 220/172 - 100/172);

    }
    if(NDMode) {
      let f_y = focusedNode_y;
      window.onresize = () => { var focusedNode_y = f_y + (0.5*window.innerHeight/172 - 220/172 - 100/172*2.5); this.props.panTo(focusedNode_x, focusedNode_y, true); };
      focusedNode_y += (0.5*window.innerHeight/172 - 220/172 - 100/172*2.5);

    }
      //focusedNode_y = focusedNode_y - (window.innerHeight/(LayoutStyle.CardHeight + LayoutStyle.PaddingV) + focusedNode_y)/2 - 200/(LayoutStyle.CardHeight + LayoutStyle.PaddingV);//focusedNode_y = -(-focusedNode_y*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) - (window.innerHeight + focusedNode_y*(LayoutStyle.CardHeight + LayoutStyle.PaddingV))/2 + 100)/(LayoutStyle.CardHeight + LayoutStyle.PaddingV);

    this.props.panTo(focusedNode_x, focusedNode_y);
  }

  componentWillMount() {
    this.panToStandard(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(shallowEqual(this.props, nextProps)) return;
    if(this.props.standard_index === null && nextProps.standard_index !== null && this.props.standard === nextProps.standard && this.props.root === nextProps.root) return;

    setTimeout( () => 
      { this.panToStandard(nextProps); }
    , 100);
    // this.panToStandard(nextProps);

    if(this.props.standard !== nextProps.standard) this.setState({highlight: null});
    if(this.props.standard && !nextProps.standard) this.setState({highlight: null});
    if(!this.props.standard && nextProps.standard) this.setState({highlight: null});

  }

  componentDidMount() {
    setTimeout( () => $('polyline.arrow').attr('stroke-dasharray', '400,0'), 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if(shallowEqual(this.props, prevProps) && prevState.highlight !== this.state.highlight) {
      $('polyline.arrow').attr('stroke-dasharray', '400,0').css('transition', 'none'); // no transition?
      return;
    }
    //$('polyline.arrow').attr('stroke-dasharray', '0,400');
    setTimeout( () => $('polyline.arrow').attr('stroke-dasharray', '400,0'), 500);


  }

  _onHighlight = (h) => {
      console.log(h);
      if(this.props.standard)
        this.setState({highlight: h});
  }
  _onTrace = (h) => {
      if(!this.props.standard)
        this.setState({highlight: h});
  }
  render() {
    // this.props.standard = '21';
    // this.props.root = '21';
    var subgraph = layoutSubGraph(this.props.root, 2, this.props.standard);
    let subgraphOriginal;
    let listClusterByStandard = function(standards) {
      let clusters = [];
      standards.forEach(_standard => {
        let cluster_id = _standard ? nodes[_standard].ccmathcluster_id: null;
        let cluster = {};
        cluster = _.map(window.cc.clusters, function(c) {
            if (c.id === cluster_id) return c;
        });
        cluster = _.without(cluster, undefined);
        cluster.standard = _standard;
        cluster.standardObj = nodes[_standard];
        let _domain = _.find(window.cc.domains, (d) => d.id === cluster[0].ccmathdomain_id);
        cluster.domain = _domain;
        cluster.domain_id = _domain.id;
        clusters.push(cluster);
      });
      return clusters;
    }

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

    let _getDomain = (!this.props.standard) ? getDomainByStandard(this.props.root) : getDomainByStandard(this.props.standard);
    let compare = function(a,b) {
      if (a.standardObj.ccmathcluster_id === b.standardObj.ccmathcluster_id &&
        (parseInt(a.standardObj.ordinal) < parseInt(b.standardObj.ordinal)))
        return -1;
      if ( a.standardObj.ccmathcluster_id === b.standardObj.ccmathcluster_id && 
        (parseInt(a.standardObj.ordinal) > parseInt(b.standardObj.ordinal))
      )
        return 1;
      return 0;
    }
    let compare2 = function(a,b) {
      if (a.domain.ordinal === b.domain.ordinal &&
        ((b[0].ordinal).localeCompare(a[0].ordinal)) > 0)
        return -1;
      if ( a.domain.ordinal === b.domain.ordinal && 
        ((a[0].ordinal).localeCompare(b[0].ordinal) < 0) 
      )
        return 1;
      return 0;
    }
    if (_getDomain && _getDomain.grade && _getDomain.grade === 'HS'
      && ((this.props.root == this.props.standard) || (this.props.root && !this.props.standard))  ) {
      subgraph.forEach((element, index) => {
        let _clusters = listClusterByStandard(element);
        let __clusters_hs = _.map(_clusters, function(c) {
          if (c.domain.grade === 'HS') return c;
        });
        __clusters_hs = _.without(__clusters_hs, undefined);
        
        let __clusters_not_hs = _.map(_clusters, function(c) {
          if (c.domain.grade !== 'HS') return c;
        });
        __clusters_not_hs = _.without(__clusters_not_hs, undefined);

        let ___clusters = [];
        __clusters_not_hs.forEach(element => {
          ___clusters.push(element);
        });
        __clusters_hs = _.sortBy(__clusters_hs, function (el) {
          return el[0].ordinal && el.domain.ordinal ;
        });
        __clusters_hs.sort(compare2);
        __clusters_hs.sort(compare);
        __clusters_hs.forEach(element => {
          ___clusters.push(element);
        });

        let _subgraph = [];
        ___clusters.forEach(_cluster => {
          _subgraph.push(_cluster.standard);
        });
        subgraph[index] = _subgraph;
      });
    }
    
    var seenNodeCount = {}; // just for stable keys for animation
    var focusedNode_i, focusedNode_j, focusedNode_x, focusedNode_y;
    subgraphOriginal = subgraph;
    if(this.props.detailLayout) {
      // remove current node's ND from the graph
      var node_nds = nodes[this.props.standard].nd_edge.map(n => n.id);
      subgraph = subgraph.map(col => col.filter(n_id => node_nds.indexOf(n_id) === -1));
      [focusedNode_i, focusedNode_j] = this._getNodeSubgraphIndexes(flattenNDNodes(subgraph), this.props.standard, null);
      // insert ND spacer above focused
      subgraph[focusedNode_i].splice(focusedNode_j, 0, null);
      focusedNode_j++;
      focusedNode_x = focusedNode_i - (subgraph.length-1)/2;
      focusedNode_y = focusedNode_j - (subgraph[focusedNode_i].length-1)/2;
    }

    var detailSpacingH = 7/6 - 2*(LayoutStyle.PaddingH/LayoutStyle.CardWidth)*0.3 - 0.08;
    var detailSpacingV = 6/6 - 2*(LayoutStyle.PaddingV/LayoutStyle.CardHeight)*0.3;

    var detailVdownFactor = 30;

    var widths = calculateWidths(subgraph, this.props.detailLayout);
    //for(var i=1;i<widths.length;i++) { widths[i] += widths[i-1]; }
    console.log(widths);
    var expandColumns = function(x) {
        var width_i = Math.floor(x + (subgraph.length-1)/2);
        //console.log(x);
        //if(focusedNode_x === 2) { console.log('...'); return x; }

        //if(x > 2) x = (x - 2) + widths[3] + widths[2];
        if(x > 1) x = (x - 1)*widths[3] + widths[2];
        else if(x < -1) x = (x - -1)*widths[0] - widths[1];
        else if(x > 0) x = x*widths[2];
        else if(x < 0) x = x*widths[1];
        return x;

      if(focusedNode_x !== undefined)
        return focusedNode_x + (x-focusedNode_x) * widths[width_i];
      return x * widths[width_i];
    };

    if(focusedNode_x !== undefined) focusedNode_x = expandColumns(focusedNode_x);


    var yPositionFromIndexes = function(i, j) {
      if(focusedNode_i !== undefined && i !== focusedNode_i) return focusedNode_j + j - (subgraph[focusedNode_i].length-1)/2 - 1;
      return j - (subgraph[i].length-1)/2;
    };
    let _checkOverlap = false;
    if (parseInt(this.props.standard) !== parseInt(this.props.root)
      && this.props.detailLayout && subgraphOriginal && subgraphOriginal[3] && subgraphOriginal[3].length > 4) {
      _checkOverlap = true;
    }
    return (
  <div className={classNames('graph', {highlighting: this.state.highlight && this.state.highlight.length})}>{
    _(subgraph).map((col, i) => {
      
      var x = i - (subgraph.length-1)/2;

      x = expandColumns(x);
      if(this.props.detailLayout) {
        var points = _.map([[x,0]], (p) => [ p[0] < focusedNode_x ? p[0] - detailSpacingH : (p[0] > focusedNode_x ? p[0] + detailSpacingH : p[0]) , p[1] ]);
        x = points[0][0];

      }


      return _.map(col, (node, j) => {
        //var y = j - (col.length-1)/2; if(this.props.detailLayout && i !== focusedNode_i) y = focusedNode_j + j - (subgraph[focusedNode_i].length-1)/2 - 1;
        var y = yPositionFromIndexes(i,j);
        var xoffsetHack = 0;
        if(this.props.detailLayout && i === focusedNode_i) {
            if(y < focusedNode_y) y -= detailSpacingV;
            //if(y > focusedNode_y) y += detailSpacingV*detailVdownFactor;
            if(y > focusedNode_y && node[0] !== 'n') return null; // don't bother showing the way-off-screen standards, the animation back is too ridiculous
            if(!node) {
              node = nodes[col[j+1]].nd_edge.filter(isParentStandard).map(n => n.id);
              xoffsetHack = -(node.length - 1)/2;
            }
        }
        if(!node.map) node = [node];
        // console.log('node => ', node);

         return node.map((node, nd_idx) => Math.abs(i - focusedNode_i) > 1 ? null : <GraphNode
          checkOverlap={_checkOverlap}
          onHighlightChild={this._onHighlight}
          onTrace={this._onTrace}
          onAdjustParentHeight={this.props.onAdjustParentHeight}
          highlighted={this.state.highlight && this.state.highlight.indexOf(node) !== -1}
          viewing={focusedNode_i === i && focusedNode_j === j}
          isRoot={i === Math.floor(subgraph.length/2) && this.props.root===node}
          onViewStandardId={this.props.standard}
          onViewStandard={this.props.onViewStandard}
          onMapStandard={this.props.onMapStandard}
          x={x+xoffsetHack*0.70+nd_idx*0.70}
          y={y}
          id={node}
          index={seenNodeCount[node]}
          key={keyName(node)} />);
        });
    }).flatten().value()

  }<svg width="4096" height="8192" viewBox="-2048 -2048 4096 8192" style={{position:'absolute'}} version="1.1">
  <defs dangerouslySetInnerHTML={{__html:`
    <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,4 L3.5,2 z" fill="#ccc"></path>
          </marker>
          <marker id="highlighted-arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L3.5,2 z" fill="#333"></path>
                </marker>
                <marker id="antihighlighted-arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,4 L3.5,2 z" fill="#7a7a7a"></path>
                      </marker>
    `}} />
    {
    _(subgraph).map((col, i) => {
      var x = i - (subgraph.length-1)/2;

      if(this.props.detailLayout) {
        if(i <= focusedNode_i - 2) x -= 1;
        if(i > focusedNode_i + 1) x += 1;
      }

      var detail_nds = [];
      if(this.props.standard) detail_nds = nodes[this.props.standard].nd_edge.filter(isParentStandard).map(n => n.id);

      var edge_polylines = _(col).map((node, j) => {
        //var y = j - (col.length-1)/2; if(this.props.detailLayout && i !== focusedNode_i) y = j + focusedNode_j;
        var y = yPositionFromIndexes(i,j);

        if(i === subgraph.length - 1) return [];
        if(!node && !this.props.standard) return [];
        if(!node) {
          //edges = _.flatten(detail_nds.map(id => nodes[id].edge.concat(nodes[id].nd_edge))).filter((edge) => subgraph[i+1].indexOf(edge.id) > -1);
          return [];
        }
        else {


        var edges = _.filter(nodes[node].edge.concat(nodes[node].nd_edge), (edge) => subgraph[i+1].indexOf(edge.id) > -1 || (false && i+1 == focusedNode_i && detail_nds.indexOf(edge.id) > -1));
        }
        //edges = _.sortBy(edges, (edge) => edge.id);

        if(this.props.detailLayout && i === focusedNode_i) {
            if(y < focusedNode_y) y -= detailSpacingV;
            if(y > focusedNode_y) y += detailSpacingV*detailVdownFactor;
        }

        var edge_polylines_for_node = _.map(edges, (edge, k) => {
          var j2 = subgraph[i+1].indexOf(edge.id);
          var detail_nd_mode = false;
          if(j2 == -1) { j2 = focusedNode_j - 1 + 0.5; detail_nd_mode = true; }
          //var y2 = j2 - (subgraph[i+1].length-1)/2; if(this.props.detailLayout && (i+1) !== focusedNode_i) y2 = j2 + focusedNode_j;
          var y2 = yPositionFromIndexes(i+1,j2);

          var x2 = x; // right side arrow endpoint w/o offset

          if(this.props.detailLayout) {
            if(i <= focusedNode_i - 2) x2 += 1;
            if(i >= focusedNode_i + 1) x2 += 1;
          }

          if(this.props.detailLayout && i + 1 === focusedNode_i) {
              if(y2 < focusedNode_y) y2 -= detailSpacingV;
              if(y2 > focusedNode_y) y2 += detailSpacingV*detailVdownFactor;
          }

          if(detail_nd_mode) { x2 += 0.70 * detail_nds.indexOf(edge.id)/2; }

          //y2 += j * 0.10;  /* prevent exact overlap of unrelated elbows */
          //y2 -= (edge.id % 2 === 1) ? 0.10 : 0;


          var points = [ [expandColumns(x) + cardRatioH,y], [expandColumns(x + 0.5), y], [expandColumns(x + 0.5), y2], [expandColumns(x2 + 0.985) - cardRatioH - arrowPadding, y2]];
          if(this.props.detailLayout) {
            points = _.map(points, (p) => [ (p[0] < focusedNode_x) ? p[0] - detailSpacingH : ((p[0] > focusedNode_x) ? p[0] + detailSpacingH : p[0]) , p[1]

            ]);
            // stretch out arrows to unfocused nodes in focused column
            for(var p2 in points) {
                if(points[p2][0] > focusedNode_x - 1.23 && points[p2][0] < focusedNode_x + 1.23) {
                  if(points[p2][1] < focusedNode_y - 0.5 || points[p2][1] > focusedNode_y + 0.5) {
                    if(points[p2][0] > focusedNode_x)
                      points[p2][0] -= 0.78;
                    else {
                      points[p2][0] += 0.78;
                    }
                  }
                }
            }
          }

          var screenPoints = _.map(points, (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
          screenPoints.node_to = edge.id;
          screenPoints.node_from = node;
          screenPoints.type = nodes[node].nd_edge.indexOf(edge) > -1 ? 'dotted' : 'arrow';
          if(screenPoints.type == 'dotted') { screenPoints[3][0] += 1.0*(arrowPadding + 0.015)*(LayoutStyle.CardWidth + LayoutStyle.PaddingH); }
          //if(screenPoints.type == 'dotted') debugger;



          return screenPoints;
        });
        return edge_polylines_for_node;
      }).flatten().filter((p) => p !== null).value();


      var intra_i = (i + 1 < subgraph.length) ? i + 1 : 0;
      var loljs_x = x;
      if(intra_i === 0) loljs_x = -1 - (subgraph.length-1)/2;
      var intra_col = subgraph[intra_i];
      if(intra_i > 0 && intra_i < 4)
      intra_col.forEach( (node_id, j) => {
        var node = nodes[node_id];
        if(!node) return;
        if(this.props.detailLayout && Math.abs(focusedNode_i - intra_i) > 1) return;
        var nd_incolumn = node.nd_edge.filter(n => intra_col.indexOf(n.id) > j);
        var d_incolumn = node.edge.filter(n => intra_col.indexOf(n.id) > -1);
        var is_adjacent = (j, j2) => Math.abs(j2 - j) === 1;
        var y = yPositionFromIndexes(intra_i, j) + 0.12;
        if(this.props.detailLayout && intra_i === focusedNode_i) {
            if(y < focusedNode_y) y -= detailSpacingV;
            if(y > focusedNode_y) y += detailSpacingV*detailVdownFactor;
        }
        let x = expandColumns(loljs_x + 1) - 0.00;
        if(this.props.detailLayout) {
          var points = _.map([[x,0]], (p) => [ p[0] < focusedNode_x ? p[0] - detailSpacingH + 1 : (p[0] > focusedNode_x ? p[0] + detailSpacingH : p[0]) , p[1] ]);
          x = points[0][0];

        }
        // collect edges separately so we can prepend them in-order
        var intra_column_edges = [];
        var intra_offset = 23/(LayoutStyle.CardWidth + LayoutStyle.PaddingH);
        nd_incolumn.forEach( to_node => {
          if(to_node.id == node_id) return;
          var j2 = intra_col.indexOf(to_node.id);
          var y2 = yPositionFromIndexes(intra_i, j2) - 0.000 + 0*0.12;
          if(this.props.detailLayout && i + 1 === focusedNode_i) {
              if(y2 < focusedNode_y) y2 -= detailSpacingV;
              if(y2 > focusedNode_y) y2 += detailSpacingV*detailVdownFactor;
          }
          if(is_adjacent(j, j2)) {

            var pl = [ [x,y+0.2], [x,(y+y2)*0.5], [x,(y+y2)*0.5], [x,y2] ];
            pl = pl.map( (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
            pl.node_to = to_node.id;
            pl.node_from = node_id;
            pl.type = 'dotted';
            pl.intra = true;
            intra_column_edges.push(pl);
            pl.no_routing = true;
          }
          else {
            var pl = [ [x - cardRatioH,y], [x  - cardRatioH - intra_offset,y], [x  - cardRatioH - intra_offset,y2], [x - cardRatioH,y2] ];
            pl = pl.map( (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
            pl.node_to = to_node.id;
            pl.node_from = node_id;
            pl.type = 'dotted';
            pl.intra = true;
            intra_column_edges.push(pl);
          }
        });

        d_incolumn.forEach( to_node => {
          if(to_node.id == node_id) return;
          var j2 = intra_col.indexOf(to_node.id);
          var y2 = yPositionFromIndexes(intra_i, j2) - 0.000 + 0*0.12;
          if(this.props.detailLayout && intra_i === focusedNode_i) {
              if(y2 < focusedNode_y) y2 -= detailSpacingV;
              if(y2 > focusedNode_y) y2 += detailSpacingV*detailVdownFactor;
          }

          var pl = [ [x - cardRatioH,y], [x- cardRatioH - intra_offset,y], [x- cardRatioH - intra_offset,y2], [x - cardRatioH - arrowPadding - 0.019,y2] ];
          pl = pl.map( (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
          pl.node_to = to_node.id;
          pl.node_from = node_id;
          pl.type = 'arrow';
          pl.intra = true;
          intra_column_edges.push(pl);
        });

        edge_polylines.unshift(...intra_column_edges);
      });


      // ND zoomed in stuff
      if(this.props.standard && i == focusedNode_i) {
          var nd_nodes = nodes[this.props.standard].nd_edge.filter(isParentStandard);
          var xoffsetHack = -(nd_nodes.length - 1)/2;
          nd_nodes.forEach((nd, nd_idx) => {
            var nd_nd = nd.nd_edge.filter(isParentStandard);
            var nd_d = nd.edge.filter(isParentStandard);
            var nd_x = expandColumns(x);
            if(this.props.detailLayout) {
              var points = _.map([[nd_x,0]], (p) => [ p[0] < focusedNode_x ? p[0] - detailSpacingH : (p[0] > focusedNode_x ? p[0] + detailSpacingH : p[0]) , p[1] ]);
              nd_x = points[0][0];

            }
            nd_x += xoffsetHack*0.70+nd_idx*0.70;

            var y = yPositionFromIndexes(i, focusedNode_j - 1) - detailSpacingV;
            nd_nd.forEach((n) => {
              var i3, j3;
              for(var i2=0;i2 < subgraph.length;i2++) {
                for(var j2=0;j2 < subgraph[i2].length;j2++) {
                  if(n.id == subgraph[i2][j2]) { i3=i2; j3=j2; }
                }
              }

              var x2 = expandColumns(i3 - (subgraph.length-1)/2);
                var points = _.map([[x2,0]], (p) => [ p[0] < focusedNode_x ? p[0] - detailSpacingH : (p[0] > focusedNode_x ? p[0] + detailSpacingH : p[0]) , p[1] ]);
                x2 = points[0][0];


              if(i3 == undefined) return;
              if(i3 !== i || j3 !== focusedNode_j) return; // :(
              var y2 = yPositionFromIndexes(i3, j3) - j3 * 0.005;

              var pl = [ [nd_x + j3 * 0.005,y+0.2 + j3 * 0.005], [nd_x + j3 * 0.005,(y + y2)*0.5 + j3 * 0.005], [x2,(y+ y2)*0.5], [x2,y2] ];
              pl = pl.map( (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
              pl.node_to = n.id;
              pl.node_from = nd.id;
              pl.type = 'dotted';
              pl.no_routing = true;
              // add distance to not same dotted lines if the root standard has many nd edges
              if (nd_nodes.length > 6) {
                if (nd_idx === 0) {
                  pl[0][0] = pl[0][0] - 15;
                  pl[1][0] = pl[1][0] - 15;
                  pl[1][1] = pl[1][1] + LayoutStyle.CardHeight/2;
                  pl[2][1] = pl[2][1] + LayoutStyle.CardHeight/2;
                }
                if (nd_idx === nd_nodes.length - 1) {
                  // pl[0][0] = pl[0][0] - 10;
                  // pl[1][0] = pl[1][0] - 10;
                  pl[1][1] = pl[1][1] + LayoutStyle.CardHeight/2;
                  pl[2][1] = pl[2][1] + LayoutStyle.CardHeight/2;
                }
              }
              edge_polylines.push(pl);

              var nd_2_nd = nd.nd_edge.filter(isParentStandard).filter(ndnd => ndnd.id !== this.props.standard);
              var nd_2_d = nd.edge.filter(isParentStandard);
              var nd_2_total = nd_2_nd.length + nd_2_d.length;
              for(var k=0;k<nd_2_total;k++) {
                let nd_2x = nd_x + (k - (nd_2_total -1)/2)*10/(LayoutStyle.CardWidth + LayoutStyle.PaddingH);
                let m = k - nd_2_nd.length;
                var pl = [ [nd_2x,y - 0.2], [nd_2x,y - 0.4], [nd_2x,y - 0.4], [nd_2x,y - 0.8]];
                pl = pl.map( (p) => [ p[0]*(LayoutStyle.CardWidth + LayoutStyle.PaddingH), p[1]*(LayoutStyle.CardHeight + LayoutStyle.PaddingV) ]);
                pl.node_to = m >= 0 ? nd_2_d[m].id : nd_2_nd[k].id;
                pl.node_from = nd.id;
                pl.type = m >= 0 ? 'arrow' : 'dotted';
                pl.no_routing = true;
                edge_polylines.push(pl);
              }


            });
            //console.log(nd_nd);
            //console.log(nd_d);
          });
      }



      // nudge lines
      /*
      polyline = [ starting point, bend1, bend2, end point ]
      if starting point
      */
      //var seen_polyline = {};
        // nudge starting points
        var arrow_grid = (edge_polylines.length > 5) ? 12 : 15;
        arrow_grid = 10;

        var seenX = {};
        var seenY = {};


        var halfGrid = null;
        var fml_max = 16;
        /*if(!window.FMLMAX) window.FMLMAX = 1;
        fml_max = window.FMLMAX;
        window.FMLMAX = window.FMLMAX + 1;*/
        for(var fml=0;(!mid_overlapped || _.max(_.map(mid_overlapped, (m) => m.length)) > 1 || _.max(_.map(end_overlapped, (m) => m.length)) > 1 || _.max(_.map(start_end_overlapped, (m) => m.length)) > 1) && fml < fml_max;fml++) {
          var mid_overlapped = [];
          var start_overlapped = [];
          var end_overlapped = [];
          var start_end_overlapped = [];
          //arrow_grid+=2;
        _.forEach(edge_polylines, (pl, pl_index) => {
            var mid_y0 = Math.min(pl[1][1], pl[2][1]) - 0.001;
            var mid_y1 = Math.max(pl[1][1], pl[2][1]) + 0.001;


            //if(pl.node_from == "214") { debugger; }

            mid_overlapped[pl_index] = [pl];
            start_overlapped[pl_index] = [pl];
            end_overlapped[pl_index] = [pl];
            start_end_overlapped[pl_index] = [pl];
            var isClose = (a,b) => { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 2; }
            var isCloseY = (a,b) => { return Math.abs(a[1] - b[1]) < 3; }

            var segment_overlap = (segA, segB, dimension, a, b) => {
              if(a[segA][1 - dimension] !== a[segA+1][1 - dimension]) console.log("invalid segment");
              var segment_tolerance = 6;
              if(Math.floor(a[segA][1 - dimension]/segment_tolerance) !== Math.floor(b[segB][1 - dimension]/segment_tolerance)) return false;
              var aMin = Math.min(a[segA][dimension], a[segA+1][dimension]);
              var bMin = Math.min(b[segB][dimension], b[segB+1][dimension]);
              var aMax = Math.max(a[segA][dimension], a[segA+1][dimension]);
              var bMax = Math.max(b[segB][dimension], b[segB+1][dimension]);
              aMin = Math.floor(aMin/segment_tolerance);
              bMin = Math.floor(bMin/segment_tolerance);
              aMax = Math.floor(aMax/segment_tolerance);
              bMax = Math.floor(bMax/segment_tolerance);


              return Math.max(aMin,bMin) < Math.min(aMax,bMax);
            }
            var addToBundle = (bundles, a, b) => {
              var i = bundles.findIndex( bundle => bundle.indexOf(a) > -1 );
              var i2 = bundles.findIndex( bundle => bundle.indexOf(b) > -1 );
              if( i > -1 && i2 === -1) bundles[i].push(b);
              if( i === -1 && i2 > -1) bundles[i2].push(a);
            }
            if(pl.no_routing) return;
            _.forEach(edge_polylines, (pl_other, pl_other_index) => {
              //if(pl_other_index <= pl_index) return;
              if(pl_other.no_routing) return;
              if(segment_overlap(0, 0, 0, pl, pl_other)) addToBundle(start_overlapped, pl, pl_other);
              if(segment_overlap(1, 1, 1, pl, pl_other)) addToBundle(mid_overlapped, pl, pl_other);
              if(segment_overlap(2, 2, 0, pl, pl_other)) addToBundle(end_overlapped, pl, pl_other);
              if(segment_overlap(0, 2, 0, pl, pl_other)) addToBundle(start_end_overlapped, pl, pl_other);
              if(segment_overlap(2, 0, 0, pl, pl_other)) addToBundle(start_end_overlapped, pl, pl_other);
            });

        });

        //console.log({i:i, s:start_overlapped, m:mid_overlapped, e:end_overlapped});
        // resolve full column
        // lets track groups of overlaps..
        for(var pl_index=0;pl_index<edge_polylines.length;pl_index++) {
          let mid_lap = mid_overlapped[pl_index];
          let start_lap = start_overlapped[pl_index];
          let end_lap = end_overlapped[pl_index];
          let start_end_lap = start_end_overlapped[pl_index];
          if(mid_lap.length > 1) {
            let lap_i = -(mid_lap.length-1)/2 + 0*Math.random();
            lap_i = Math.floor(lap_i);
            _.forEach(mid_lap, (pl,i) => {
              var direction = (pl[1][1] > pl[2][1]) ? 1 : -1;
              if(i > fml && (fml % 2)) return;
              if(fml>7) direction = 1;
              //else if(fml>3) direction *= -3;
              else if(fml>0) direction *= -1;
              if(pl.intra) { direction = -1; if(lap_i < 0) lap_i = i; } /* only move intracolumn lines left! */
              //var direction = _.sum(pl, (p)=>p[1])/pl.length > _.sum(mid_lap, (pl)=>pl[1][1]+pl[2][1]) / mid_lap.length ? -1 : 1;
              pl[1][0] += lap_i * arrow_grid*direction;
              pl[2][0] += lap_i * arrow_grid*direction;
              if(!pl.log) pl.log="";
              pl.log += "M-plus" + lap_i + "-times" + direction + " ";
              lap_i += 1.0;
              //if(lap_i > 9) lap_i = 9;
            });
          }
          // start cycling these crazy guys
          if(start_end_lap.length > 1) {
            var tmp_x = start_end_lap[0][1][0];
            if(tmp_x === start_end_lap[1][1][0]) { console.log('se mid lap'); tmp_x -= arrow_grid; }
            for(let lap_i = 0;lap_i<start_end_lap.length - 1;lap_i++) {
              start_end_lap[lap_i][1][0] = start_end_lap[lap_i + 1][1][0];
              start_end_lap[lap_i][2][0] = start_end_lap[lap_i + 1][2][0];
              start_end_lap[lap_i].log += "cycle ";
              if(fml > 1) {
                if(fml < 16 || lap_i < fml % start_end_lap.length) {
                  tmp_x -= arrow_grid;
                  start_end_lap[lap_i][0][1] += arrow_grid*2;
                  start_end_lap[lap_i][1][1] += arrow_grid*2;
                }
              }
            }
            start_end_lap[start_end_lap.length - 1][1][0] = tmp_x;
            start_end_lap[start_end_lap.length - 1][2][0] = tmp_x;
          }
          if(start_lap.length > 1) {
            let lap_i = -(start_lap.length-1)/2 + 0*Math.random();
            lap_i = Math.floor(lap_i);
            //if((Math.floor(lap_i) !== lap_i)) lap_i -= 0.5;
            _.forEach(start_lap, (pl) => {
              if(pl[0][1] === pl[3][1]) { // try to keep straight arrow
                _.range(2,4).forEach((p) => pl[p][1] += lap_i * arrow_grid);
                /*pl[2][1] += lap_i * arrow_grid;
                pl[3][1] += lap_i * arrow_grid;
                pl[4][1] += lap_i * arrow_grid;
                pl[5][1] += lap_i * arrow_grid;
                pl[6][1] += lap_i * arrow_grid;
                pl[7][1] += lap_i * arrow_grid;*/
              }
              pl[0][1] += lap_i * arrow_grid;
              pl[1][1] += lap_i * arrow_grid;
              pl.log += "S-plus" + lap_i + " ";
              lap_i += 1.0;
            });
          }
          else if(end_lap.length > 1 ) {
            let lap_i = -(end_lap.length-1)/2 + 0*Math.random();
            lap_i = Math.floor(lap_i);
            //if((Math.floor(lap_i) !== lap_i)) lap_i -= 0.5;
            _.forEach(end_lap, (pl) => {
              if(pl[0][1] === pl[3][1]) { // try to keep straight arrow
                pl[0][1] += lap_i * arrow_grid;
                pl[1][1] += lap_i * arrow_grid;
              }
              _.range(2,4).forEach((p) => pl[p][1] += lap_i * arrow_grid);
              /*pl[2][1] += lap_i * arrow_grid;
              pl[3][1] += lap_i * arrow_grid;
              pl[4][1] += lap_i * arrow_grid;
              pl[5][1] += lap_i * arrow_grid;
              pl[6][1] += lap_i * arrow_grid;
              pl[7][1] += lap_i * arrow_grid;*/
              pl.log += "E-plus" + lap_i + " ";
              lap_i += 1.0;
            });
          }
        }
        }
        if(fml >= fml_max - 1) { console.log("gave up on routing col" + i); console.log(mid_overlapped); }

        // console.log('edge_polylines => ', edge_polylines);

      return _.map(edge_polylines, (pl) =>
          [/*<polyline fill="none" stroke="#f4f5f0" strokeWidth="10px" strokeLinecap="butt" key={Math.random()} points={makeSVGPointString(pl)}/>,*/
          <polyline className={classNames(pl.type, pl.log, pl.node_from,  pl.node_to, {highlighted:this.state.highlight && !(this.state.highlight.indexOf(pl.node_from) === -1 && this.state.highlight.indexOf(pl.node_to) === -1) && (!this.props.detailLayout || pl.node_from == this.props.standard || pl.node_to == this.props.standard) })} fill="none" stroke="#cccccc" strokeWidth="2px" strokeLinecap="butt" strokeDasharray={pl.type==='dotted'?'6,3':'0,400'} markerEnd="url(#arrow)" key={Math.random()} points={makeSVGPointString(pl)}/>]
        ).sort(function(a,b) { return (/highlighted/.test(a[0].props.className) && !/highlighted/.test(b[0].props.className)) ? 1 : -1;  });
    }).flatten().value()
  }</svg></div>);
  }
}
