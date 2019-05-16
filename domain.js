
var shallowEqual = require('react/lib/shallowEqual');

var ClusterDesc = require('./clusterdesc').ClusterDesc;
var ClusterName = require('./clusterdesc').ClusterName;

var Collapse = require('./collapse');

var Icons = require('./icons');

var standardCode = require('./standards-utils').standardCode;

var formatHTML = require('./standards-utils').formatHTML;

var ReactMeta = require('./reactmeta').ReactMeta;
var classNames = require('classnames');

import { layoutSubGraph, collapseHeight } from './helpers/utils';
// Styles
import './scss/domain.scss';

export class ChildStandardHasSubGraph extends React.Component {
  render() {
    const { s } = this.props;
    return (
      <div className='standards standards-has-subgraph'>
        {_(window.cc.standards).pick((x) => x.ccmathcluster_id === window.cc.standards[s].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s].ordinal + '.') === 0).values().map((cs) =>
          <div key={cs.id} className='standard node child-standard-has-subgraph' >
            <h3>{standardCode(cs.id)}</h3>
            <StandardsDesc desc={cs.desc} domain={this.props.domain} />
            <button onClick={() => this.props.onSelectStandard(cs.id)}>Map Standard <Icons.Boxes /></button>
          </div>
          ).value()}
      </div>
    );
  }
}

export class ChildStandardHasNoSubGraph extends React.Component {
  
  render() {
    
    const { s } = this.props;
    let _childStandards = _(window.cc.standards).pick((x) => x.ccmathcluster_id===window.cc.standards[s].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s].ordinal+'.')===0).keys().value();
    return (
      <div className='standards'>
        {window.cc.standards[s].desc.replace(/(<([^>]+)>)/ig,'').length > (70*5) || _(window.cc.standards).pick((x) => x.ccmathcluster_id===window.cc.standards[s].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s].ordinal+'.')===0).keys().value().length ?
          ( _childStandards && _childStandards.length > 0 ?
            <div>
              <p className='standard-desc' dangerouslySetInnerHTML={{__html:formatHTML(window.cc.standards[s].desc)}}></p>
              <button onClick={() => this.props.onSelectStandard(s)} className='button-hs-has-childs'>Map Standard <Icons.Boxes /></button>
              <Collapse title='' minHeight={collapseHeight(window.cc.standards[s])}>
                <div className="child-standards">
                { _(window.cc.standards).pick((x) => x.ccmathcluster_id===window.cc.standards[s].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s].ordinal+'.')===0).values().map((cs) => 
                  <Collapse disabled={true} minHeight={100} key={cs.id} title={standardCode(cs.id)}>
                  <StandardsDesc desc={cs.desc} domain={this.props.domain}/>
                  </Collapse>).value()
                }
                </div>
              </Collapse>
            </div>
            : (
              <div>
                <StandardsDesc desc={window.cc.standards[s].desc} domain={this.props.domain} />
                <button onClick={() => this.props.onSelectStandard(s)}>Map Standard <Icons.Boxes /></button>
              </div>
            )
            
          )
          : (
            <div>
              <StandardsDesc desc={window.cc.standards[s].desc} domain={this.props.domain} />
              <button onClick={() => this.props.onSelectStandard(s)}>Map Standard <Icons.Boxes /></button>
            </div>
          )
          }
        
      </div>
    );
  }
}

class StandardsDesc extends React.Component {
  static propTypes = {
    desc: React.PropTypes.string.isRequired
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
  render() {

    let _desc = formatHTML(this.props.desc).trim();
    let isPlusStandard = false;
    if (this.props.domain && this.props.domain.grade === 'HS') {
      let searchString = _desc.indexOf('(+)'); // (+)
      if (searchString === 0) {
        isPlusStandard = true;
      }
      _desc = searchString === 0 ? _desc.substring(3) : _desc;
    }
    return (
      <div className="standard-desc-plus">
        {isPlusStandard &&
          <p className="plus" onClick={
            () => $(document).trigger('defineTerm', {
              title: 'Plus Standards', desc: `
                The high school standards specify the mathematics that all students should study in order 
                to be college- and career-ready. 
                Additional mathematics that students should learn in order to take advanced courses such as 
                calculus, advanced statistics, or discrete mathematics is indicated by (+).
                ` })}>(+)</p>
        }
        <p className='standard-desc' dangerouslySetInnerHTML={{ __html: _desc }}></p>
      </div>
    );
  }
}

export class Cluster extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  static propTypes = {
    domain: React.PropTypes.object,
    cluster: React.PropTypes.object,
    onSelectStandard: React.PropTypes.func,
  };

  render() {
    
    // var standards = window.standards.filter((s) => s.id.indexOf(this.props.cluster+'.')>-1);
    // var standards = _.pick(window.cc.standards, (s) => s.ccmathcluster_id === this.props.cluster.id && s.ordinal.indexOf('.') === -1);//  _.groupBy(standards, (s) => s.id.split('.').slice(0,3).join('.') );
    let compare = function(a,b) {
      if (parseInt(a.ordinal) < parseInt(b.ordinal))
        return -1;
      if (parseInt(a.ordinal) > parseInt(b.ordinal))
        return 1;
      return 0;
    }
    var standards = _.filter(window.cc.standards, (s) => s.ccmathcluster_id === this.props.cluster.id && s.ordinal.indexOf('.') === -1 );
    standards.sort(compare);
    var collapseHeight = function (s) {
      var lines = Math.ceil(s.desc.replace(/(<([^>]+)>)/ig, '').length / 70);
      var hasChild = _(window.cc.standards).pick((x) => x.ccmathcluster_id === s.ccmathcluster_id && x.ordinal.indexOf(s.ordinal + '.') === 0).values().value().length > 0;
      if (lines < 5) {
        return 128 + 24 * lines + (hasChild ? 100 : 0);
      }
      lines = Math.min(lines, 4);
      return 128 + 24 * lines;
    };
    let childStandardsNoParent = [];
    standards.map((s) => {
      let childStandards = _(window.cc.standards).pick((x) => x.ccmathcluster_id === window.cc.standards[s.id].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s.id].ordinal + '.') === 0).values().value();
      let hasALLChildSubGraph = false;
      childStandards.forEach(standard => {

        let subgraph = layoutSubGraph(parentNodes, standard.id, 2, standard.id);
        let flattenSubgraph = _.flatten(subgraph);
        let subgraphNoCurrentRoot = _.without(flattenSubgraph, standard.id);
        if (subgraphNoCurrentRoot && subgraphNoCurrentRoot.length > 0) {
          hasALLChildSubGraph = true;
        }
      });
      if (hasALLChildSubGraph) {
        childStandardsNoParent.push(window.cc.standards[s.id].id);
      }
    }
    );

    return (<div className='cluster-container'>
      <ClusterName name={this.props.cluster.name} />
      <ClusterDesc msa={this.props.cluster.msa} grade={this.props.domain.grade} standards={standards}/>
      {(this.props.domain && this.props.domain.grade === 'HS') ?
        (
          // <ChildStandardsNoParent standards={standards} childStandardsNoParent={childStandardsNoParent} />
          <div className='standards'>{
            standards.map((s) =>
              <div key={s.id} className={classNames('standard node', {'standard-hs': (childStandardsNoParent.indexOf(window.cc.standards[s.id].id) <= -1)})} >
                <h1>{standardCode(window.cc.standards[s.id].id)}</h1>
                {
                  (childStandardsNoParent.indexOf(window.cc.standards[s.id].id) > -1) &&
                    <StandardsDesc desc={window.cc.standards[s.id].desc} domain={this.props.domain} />
                }
                <div>
                  {(childStandardsNoParent.indexOf(window.cc.standards[s.id].id) > -1) ?
                    (
                      <ChildStandardHasSubGraph 
                        s={s.id} standards={standards} 
                        childStandardsNoParent={childStandardsNoParent} 
                        domain={this.props.domain} 
                        onSelectStandard={this.props.onSelectStandard} />
                    )
                    :
                    (
                      <ChildStandardHasNoSubGraph 
                        s={s.id} 
                        standards={standards} 
                        domain={this.props.domain} 
                        onSelectStandard={this.props.onSelectStandard} />
                    )
                  }
                </div>
              </div>
            )
          }</div>
        )
        : (
          <div className='standards'>{
            standards.map((s) =>
              <div key={s.id} className='standard node' >
                <h1>{standardCode(window.cc.standards[s.id].id)}</h1>
                {window.cc.standards[s.id].desc.replace(/(<([^>]+)>)/ig, '').length > (70 * 5) || _(window.cc.standards).pick((x) => x.ccmathcluster_id === window.cc.standards[s.id].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s.id].ordinal + '.') === 0).keys().value().length ?
                  <Collapse title='' minHeight={collapseHeight(window.cc.standards[s.id])}><p className='standard-desc' dangerouslySetInnerHTML={{ __html: formatHTML(window.cc.standards[s.id].desc) }}></p>
                    <div className="child-standards">
                      {_(window.cc.standards).pick((x) => x.ccmathcluster_id === window.cc.standards[s.id].ccmathcluster_id && x.ordinal.indexOf(window.cc.standards[s.id].ordinal + '.') === 0).values().map((cs) =>
                        <Collapse disabled={true} minHeight={100} key={cs.id} title={standardCode(cs.id)}>
                          <StandardsDesc desc={cs.desc} />
                          </Collapse>).value()
                      }
                    </div>
                  </Collapse>
                  :
                  <StandardsDesc desc={window.cc.standards[s.id].desc} domain={this.props.domain} />}
                <button onClick={() => this.props.onSelectStandard(s.id)}>Map Standard <Icons.Boxes /></button>
              </div>
            )
          }</div>
        )
      }

    </div>);
  }
}

export class Domain extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  static propTypes = {
    domain: React.PropTypes.string,
    onSelectStandard: React.PropTypes.func,
  };

  //state = {selectedGrade: null};

  render() {

    //var standards = window.standards.filter((s) => s.id.indexOf(this.props.domain+'.')>-1);

    let clusters = _.pick(window.cc.clusters, (c) => c.ccmathdomain_id === this.props.domain);//  _.groupBy(standards, (s) => s.id.split('.').slice(0,3).join('.') );

    let _clusters =  _.sortBy(clusters, 'ordinal');
    return (<div className='domain-page'>
      <ReactMeta title={window.cc.domains[this.props.domain].grade + '.' + window.cc.domains[this.props.domain].ordinal + ' - ' + window.cc.domains[this.props.domain].name} />
      {
       _clusters.map((c, index) =>
          <Cluster key={index} domain={window.cc.domains[this.props.domain]} cluster={window.cc.clusters[c.id]} onSelectStandard={this.props.onSelectStandard} />
        )
      }
    </div>);
  }
}


/*
Domain
  <div topleft=expanded ? z*2 : z>



<Cards />
  <Grade name=K />
    <Domain name=K.NBT />
      */
