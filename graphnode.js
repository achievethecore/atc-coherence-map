var Component = require('react').Component;
var shallowEqual = require('react/lib/shallowEqual');
var LayoutStyle = require('./style').LayoutStyle;
var classNames = require('classnames');
var standardCode = require('./standards-utils').standardCode;
var formatHTML = require('./standards-utils').formatHTML;
var Icons = require('./icons');

var Collapse = require('./collapse');

var ClusterDesc = require('./clusterdesc').ClusterDesc;
var ClusterName = require('./clusterdesc').ClusterName;

var ReactMeta = require('./reactmeta').ReactMeta;

var Course = require('./components/course/course');

// Styles
import './scss/graphnode.scss';

class StandardsDesc extends Component {
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
            { isPlusStandard &&
              <p className="plus" onClick={
                () => $(document).trigger('defineTerm', { title: 'Plus Standards', desc: `
                The high school standards specify the mathematics that all students should study in order 
                to be college- and career-ready. 
                Additional mathematics that students should learn in order to take advanced courses such as 
                calculus, advanced statistics, or discrete mathematics is indicated by (+).
                ` } )}>(+)</p>
            }
            <p className='standard-desc' dangerouslySetInnerHTML={{__html:_desc}}></p>
          </div>
        );
    }
}

export default class Node extends Component {
  static propTypes = {
    viewing: React.PropTypes.bool.isRequired,
    isRoot: React.PropTypes.bool.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    id: React.PropTypes.string.isRequired,
    onAdjustParentHeight: React.PropTypes.func.isRequired,
    onViewStandard: React.PropTypes.func.isRequired,
    onMapStandard: React.PropTypes.func.isRequired,
    onHighlightChild: React.PropTypes.func.isRequired,
  };

  activeChild = null;

  cachedMathJax = null;

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  _fixHeight = (offset) => {
    if(offset === undefined) offset = 0;
    var domnode = React.findDOMNode(this);
    if(domnode && domnode.scrollHeight && this.props.viewing /*&& (domnode.scrollHeight+'px') !== domnode.style.height*/) {
      domnode.style.height = 0 + 'px';
      var newHeight = offset + domnode.scrollHeight;
      //var maxGraphHeight = _.max($('.node').map((i,e) => (e.offsetTop/2 + window.innerHeight + 132*2)));
      var maxGraphHeight = _.max($('.node').map((i,e) => (e.offsetTop - domnode.offsetTop + 220 + 40 + 40)));
      newHeight = Math.max(maxGraphHeight, newHeight);
      //domnode.style.height = newHeight + 'px';
      domnode.style.height = 'auto';
      this.props.onAdjustParentHeight(newHeight + 60 - window.innerHeight/2 + 220);
    }
    else
      domnode.style.height = LayoutStyle.CardHeight/0.3 + 'px';
  }

  componentDidMount() {
    this._fixHeight();
    if(!this.props.viewing) { return; }
    var domnode = React.findDOMNode(this);
    $(domnode).find('img').on('load', () => this._fixHeight());// if(this.props.viewing) setTimeout(() => this.forceUpdate(), 500);
    if(this.props.viewing) MathJax.Hub.Queue(['Typeset',MathJax.Hub, $(domnode).find('.example-problem')[0]], () => this._fixHeight(), () => {this.cachedMathJax = domnode.innerHTML;}); // eslint-disable-line new-cap
    
    if(this.props.viewing) MathJax.Hub.Queue(['Typeset',MathJax.Hub, $(domnode).find('.example-problem-mathjax')[0]], () => this._fixHeight(), () => {this.cachedMathJax = domnode.innerHTML;});
    setTimeout(() => {
      $('.node').not('.is-root').not('.viewing-node').each((i,e)=>{
        let children_el = $(e).children();
        let total_height = 0;
        children_el.each((i,el)=>{
          total_height += $(el).outerHeight();
        });
        let standard_desc_plus_el = $(e).find('.standard-desc-plus');
        if (total_height >= 300) {
          standard_desc_plus_el.addClass('overlapped');
        }
      });
    }, 500);
  }
  componentDidUpdate(prevProps) {
    //if((!!prevProps.highlighted) !== (!!this.props.highlighted)) return;
    //return;
    this._fixHeight();
    if(!this.props.viewing) { this.activeChild = null; return; }
    var domnode = React.findDOMNode(this);
    //if(this.props.viewing) setTimeout(() => this.forceUpdate(), 500);
    $(domnode).find('img').on('load', () => this._fixHeight());//
    // 2 many buge if(this.cachedMathJax && this.props.viewing) { domnode.innerHTML = this.cachedMathJax; this._fixHeight(); return; }
    setTimeout(() => {
      if(this.props.viewing) MathJax.Hub.Queue(['Typeset',MathJax.Hub, $(domnode).find('.example-problem')[0]], () => this._fixHeight(), () => {this.cachedMathJax = domnode.innerHTML;}); // eslint-disable-line new-cap
      if(this.props.viewing) MathJax.Hub.Queue(['Typeset',MathJax.Hub, $(domnode).find('.example-problem-mathjax')[0]], () => this._fixHeight(), () => {this.cachedMathJax = domnode.innerHTML;});
    }, 'ontouchstart' in document ? 300 : 0);
  }

  formatProblem(s,std) {
      if(!s) return s;
      s = s.replace('</h1>', '</h1><div class="example-problem-byline">' + std.example_problem_attribution + '</div>');
      s = $(s);
      s.find('p:contains("\xA0")').filter(function() { return $(this).text().length < 2; }).remove();
      //s.find('a[name][id]').each( (i,e) => { e.setAttribute('title', e.getAttribute('name'); } );
      s.find('a[name][id]').each( function() { this.href = "javascript:showTip(\'"+this.innerHTML+'\',\''+this.id.replace('\'','\\\'')+"\')"; });
      s.find('ul li a').addClass('button').attr('target', '_blank').each((i,e)=>{ e.setAttribute('href', 'https://www.illustrativemathematics.org' + e.getAttribute('href')); } ).unwrap();
      return s.wrapAll('<div>').parent().html();
  }

  collapseChild = () => {
    this.activeChild = null;
    this.props.onHighlightChild(null);
  }

  expandChild = (s) => {
    if(this.activeChild && this.activeChild !== s.id) {
      this.refs['collapse' + this.activeChild]._onClick(); // yikes
    }
    console.log(this.refs['collapse' + s.id]);
    this.activeChild = s.id;
    var standard = window.cc.standards[this.props.id];
    this.props.onHighlightChild(s.rev_edge.concat(s.edge).concat(s.nd_edge).map((e)=>window.parentNodeOf(e).id).filter(id => id !== standard.id &&  window.parentNodes[id]))
  }

  _onViewStandard = () => {
    if (!this.props.viewing) {
      return this.props.onViewStandard(this.props.id, this.props.index);
    }
  }

  render() {
    var standard = window.cc.standards[this.props.id];
    var cluster = window.cc.clusters[standard.ccmathcluster_id];
    var domain = window.cc.domains[cluster.ccmathdomain_id];
    let parent_standard;
    if (this.props.viewing) {
      let _all_standards_same = _(window.cc.standards).pick((s) => s.ccmathcluster_id===standard.ccmathcluster_id && standard.ordinal.indexOf(s.ordinal) > -1).values().value() || [];
      let all_standards_same = _.filter(_all_standards_same, (s) => s.id != standard.id);
      if (all_standards_same && all_standards_same[0]) {
        parent_standard = all_standards_same[0];
      }
    }
      
    if(this.props.viewing)
        var child_standards = _(window.cc.standards).pick((s) => s.ccmathcluster_id===standard.ccmathcluster_id && s.ordinal.indexOf(standard.ordinal+'.')===0).values().value() || [];
    
    var progressionsDocs = {OA: 1172, CC: 1172, NBT: 1171, MD: (standard.md == 1 ? 1170 : 1169), G: (/7|8|HS/.test(domain.grade) ? 3479 : 1168), NF:1173, RP: 1177, EE:1175, SP:1174,NS:1176, F:1180,
      N: 3480,
      S: 1178,
      A: 1179,
    };
    var progressions = 'http://achievethecore.org/file/' + progressionsDocs[domain.ordinal.split('-')[0]];

    var focus = `http://achievethecore.org/content/upload/SAP_Focus_Math_${domain.grade}.pdf`;
    if(domain.grade === '0')
      focus = 'http://achievethecore.org/content/upload/SAP_Focus_Math_K%2011.12.14.pdf';

    if (domain.grade === 'HS') {
      focus = 'https://achievethecore.org/content/upload/Widely%20Applicable%20Prerequisites.pdf';
    }
    //var translateString = 'translate('+this.props.x*(LayoutStyle.CardWidth + LayoutStyle.PaddingH)+'px,'+this.props.y*(LayoutStyle.CardHeight + LayoutStyle.PaddingV)+'px) ';
    let _top = this.props.y*(LayoutStyle.CardHeight + LayoutStyle.PaddingV);
    return (
    <div className={classNames('node', {'is-root':this.props.isRoot, 'viewing-node':this.props.viewing, 'highlighted':this.props.highlighted})} style={{
      position: 'absolute',
      top: (this.props.isRoot && this.props.checkOverlap && _top === -86 ) ? _top + 10 : _top,
      left: this.props.x*(LayoutStyle.CardWidth + LayoutStyle.PaddingH),
      width: LayoutStyle.CardWidth/0.3,
      height: LayoutStyle.CardHeight/0.3,
      background: 'white',
      boxShadow: ((this.props.isRoot) ? '-1px 1px #25a56a, -2px 2px #25a56a, -3px 3px #25a56a' : '-1px 1px #d9d7d2, -2px 2px #d9d7d2, -3px 3px #d9d7d2' )/* + (this.props.viewing ? ', 0px 440px 5px 15px #f4f5f0' : '')*/,
      padding: '40px 40px 0 40px',
      zIndex: (this.props.viewing) ? 2 : 1,
      overflow: (this.props.isRoot) ? 'visible' : 'hidden',
      //WebkitBackfaceVisibility: 'hidden',
      //WebkitTransformStyle: 'preserve-3d',
      //WebkitPerspective: 1000,
      WebkitTransformOrigin: '50% ' + LayoutStyle.CardHeight/0.6 + 'px',
      transformOrigin: '50% ' + LayoutStyle.CardHeight/0.6 + 'px',
      transform: ((this.props.viewing) ? 'translate(-50%, -220px) scale(1.0) translateZ(0)' : 'translate(-50%, -220px) scale(0.3)  translateZ(0)'),
      WebkitTransform: ((this.props.viewing) ? 'translate(-50%, -220px) scale(1.0)  translateZ(0)' : 'translate(-50%, -220px) scale(0.3)  translateZ(0)'),
      msTransform: ((this.props.viewing) ? 'translate(-50%, -220px) scale(1.0)' : 'translate(-50%, -220px) scale(0.3)')
    }}

     onClick={() => this._onViewStandard()}
     onMouseEnter={() => this.props.onTrace([standard.id])}
     onMouseLeave={() => this.props.onTrace(null)}
      >
          {this.props.viewing ? <ReactMeta title={standardCode(standard.id) + ' - ' + domain.name} desc={standard.desc} /> : null }
          <h2>{domain.name}</h2>
          <ClusterName name={cluster.name} />
          <ClusterDesc msa={cluster.msa} wap={standard.wap} grade={domain.grade} />
          {standard.modeling === '1' && domain.grade !== 'HS' ?
            <p onClick={() => $(document).trigger('defineTerm', {
                title:'Modeling Standard',
                desc:'Modeling is best interpreted not as a collection of isolated topics but rather in relation to other standards. Making mathematical models is a Standard for Mathematical Practice, and specific modeling standards appear throughout the high school standards indicated by a star symbol ★'
              })} className='modeling'>Modeling Standard ★</p>
            : null }
          {standard.modeling === '1' && domain.grade === 'HS' ?
            <p onClick={() => $(document).trigger('defineLearnMoreAboutModeling', {
                title:'Modeling Standards',
                desc:`Modeling is the process of choosing and using appropriate mathematics and 
                  statistics to analyze empirical situations, to understand them better, 
                  and to improve decisions. Making mathematical models is a Standard for Mathematical 
                  Practice in all grades and a conceptual category in high school. 
                  Modeling content standards such as this one are indicated by a star symbol ★.`
              })} className='modeling'>Modeling Standard ★</p>
            : null }
          {
            ( domain.grade === 'HS' && parent_standard) &&
            (
              <div>
                <h3 className='parent-standard-name'>{standardCode(parent_standard.id)}</h3>
                <StandardsDesc desc={parent_standard.desc} domain={domain} />
                <hr className="mt-35"></hr>
              </div>
            )
          }
          <h1>{standardCode(standard.id)}</h1>
          <StandardsDesc desc={standard.desc} domain={domain} />
          {this.props.isRoot ? 
            <div className='root-icon' key='rooticon'>
              <Icons.Pin/>
            </div> : 
            // domain.grade !== 'HS' && 
              <button key='mapstandard'
                className={classNames({'btn-mapstandard' : parseInt(this.props.onViewStandardId) !== parseInt(standard.id)})}
                onClick={(e) => {e.stopPropagation(); this.props.onMapStandard(this.props.id);}}>
                Map Standard <Icons.Boxes/>
              </button>
          }
          {this.props.viewing ? <button className='close' onClick={(e) => {e.stopPropagation(); this.props.onAdjustParentHeight(null); this.props.onViewStandard(null);} }><Icons.ZoomOut /><span className='zoomtip'>Click to zoom out</span></button> : null}
          {this.props.viewing ?
            <div className="detail-content">
              { standard.example_problem && domain.grade === 'HS' ? <hr className="mt-35"/> : '' }
              {domain.grade === 'HS' && <Course standard={standard} />}
              
              <div className="child-standards">
              {child_standards.map((s) => <Collapse ref={'collapse'+s.id} disabled={false /*_.intersection(s.rev_edge.concat(s.edge).concat(s.nd_edge), standard.rev_edge.concat(standard.edge).concat(standard.nd_edge)).map((e)=>e.ordinal).filter(o=>o.indexOf('.')===-1).length === 0*/} minHeight={90} key={s.id} title={standardCode(s.id)} onAdjustParentHeight={this._fixHeight} onExpand={() => this.expandChild(s)} onCollapse={this.collapseChild}><StandardsDesc desc={s.desc} domain={domain}/></Collapse>)}
              </div>
              { false && standard.example_problem ?
                <Collapse minHeight={180} title='Example Task' onAdjustParentHeight={this._fixHeight}>
                  <div className='example-problem' dangerouslySetInnerHTML={{__html:this.formatProblem(standard.example_problem, standard)}} />
                  <a href={standard.example_problem_url} target='_blank' className='example-download button'>Download Example Task <Icons.ArrowDL /></a>
                </Collapse> : null }
             
              { child_standards.length < 1 && domain.grade === 'HS' ? <hr className="mt-35"/> : '' }

              { standard.example_problem ?
              <h3 className="example-problem-header">Example Task</h3> : null}
              { standard.example_problem ?
                <div className="example-problem">{
                    (() => {
                      var stuff = this.formatProblem(standard.example_problem, standard);
                      var $stuff = $('<div>'+stuff+'</div>');
                      var $children = $stuff.children(); //$stuff.map(function() { return this.outerHTML; });
                      return $children.map( (i,e) => e.tagName === 'DIV' && e.className === 'detail' && e.innerHTML.length > 490 ?
                        <Collapse minHeight={198} key={'c'+i} title='' onAdjustParentHeight={this._fixHeight}><div className='detail' dangerouslySetInnerHTML={{__html:e.innerHTML}} /></Collapse> :
                        <div className='non-collapse' dangerouslySetInnerHTML={{__html:e.outerHTML}} /> ).get();
                    })()
                  }</div> : null}
              {/*{ standard.example_problem ?
              <div className="example-problem" dangerouslySetInnerHTML={{__html:this.formatProblem(standard.example_problem, standard)}} /> : null}*/}
              { standard.example_problem_url ?
              <a href={standard.example_problem_url} target='_blank' className="example-download button">Download Example Task <Icons.ArrowDL /></a> : null}
              { standard.progressions ?
              <Collapse title="Progressions" onAdjustParentHeight={this._fixHeight} isProgressions={true}>
                <div className="progressions example-problem example-problem-mathjax" 
                  dangerouslySetInnerHTML={{__html:standard.progressions}} 
                />
                <a href={progressions} target='_blank' className="example-download button">Download Progressions PDF <Icons.ArrowDL /></a>
              </Collapse> : null}
              {standard.links && standard.links.map((l) => <Collapse title={l.name} onAdjustParentHeight={this._fixHeight} key={l.name}>{l.links.map((l)=><a className='button linkout' key={l.url} href={l.url} target='_blank'>{l.name} <Icons.ArrowExt /></a>)}</Collapse>)}
              <Collapse title='Focus' onAdjustParentHeight={this._fixHeight} key='focus'>
                { domain.grade !== 'HS' ?
                  <a className='button linkout' key='focus' href={focus} target='_blank'>
                    Focus in {domain.grade === '0' ? 'Kindergarten' : `Grade ${domain.grade}`} 
                    <Icons.ArrowExt />
                  </a>  :
                  <a className='button linkout' key='focus' href={focus} target='_blank'>
                    Widely Applicable Prerequisites – High School 
                    <Icons.ArrowExt />
                  </a>
                }
                
              </Collapse>
            </div>
          : null
          }
      </div>);
  }
}
