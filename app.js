window.React = require('react/addons');
var Component = React.Component;
var ReactCSSTransitionGroup = require('timeout-transition-group');
window._ = require('lodash');
React.initializeTouchEvents(true);

var LayoutStyle = require('./style').LayoutStyle;

var classNames = require('classnames');

var Landing = require('./landing');

var Deck = require('./cards').Deck;

var Domain = require('./domain').Domain;

import CourseInfoModal from './components/modals/course-info-modal';
import ModalLink from './components/modals/modal-link';
import Modeling from './components/modeling/modeling';
import CourseInfomation from './components/course/course-info/course-info';
import SubNavStandard from './components/standard/sub-nav-standard/sub-nav-standard';
import ModelingStandardModal from './components/modals/modeling-standard-modal';
import ModelingLanding from './components/modeling/modeling-landing/modeling-landing';
import MoreAboutModeling from './components/modeling/more-about-modeling/more-about-modeling';
import ModelingTasks from './components/modeling/modeling-tasks/modeling-tasks';

/* Config */
import { Config } from './config/app.config';

// Styles
import './scss/app.scss';

window.showTip = function(a,b) { 
  window.disableScrollTop = true;
  setTimeout(() => {
    window.disableScrollTop = false;
  }, 1000);
  $(document).trigger('defineTerm', {title:a,desc:b}); 
};

var userAgent = window.navigator.userAgent;
var isOldMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(userAgent) && (function() {
   // Regexp for iOS-version tested against the following userAgent strings:
   // Example WebView UserAgents:
   // * iOS Chrome on iOS8: "Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/39.0.2171.50 Mobile/12B410 Safari/600.1.4"
   // * iOS Facebook on iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201 [FBAN/FBIOS;FBAV/12.1.0.24.20; FBBV/3214247; FBDV/iPhone6,1;FBMD/iPhone; FBSN/iPhone OS;FBSV/7.1.1; FBSS/2; FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5]"
   // Example Safari UserAgents:
   // * Safari iOS8: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
   // * Safari iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53"
   var iOSversion = userAgent.match(/OS (\d)/);
   // viewport units work fine in mobile Safari and webView on iOS 8+
   return iOSversion && iOSversion.length>1 && parseInt(iOSversion[1]) < 8;
 })();

class Spotlight extends Component {
  static propTypes = {
    spotlightX: React.PropTypes.number.isRequired,
    spotlightY: React.PropTypes.number.isRequired,
  };

    render() {
        return <div className='spotlight'><div className='mask' style={{left: this.props.spotlightX*0, top: this.props.spotlightY*0, backgroundPosition:`${this.props.spotlightX}px ${this.props.spotlightY}px` }} /></div>;
    }
}

class Modal extends Component {
  static propTypes = {
    modalTitle: React.PropTypes.string.isRequired,
    modalCTA: React.PropTypes.string,
    modalClass: React.PropTypes.string,
    modalClose: React.PropTypes.bool.isRequired,
    modalBG: React.PropTypes.bool.isRequired,
    // modalIMG: React.PropTypes.element.isRequired,
    modalOnClose: React.PropTypes.func.isRequired,
    modalCookie: React.PropTypes.bool,
    introPage: React.PropTypes.number,
    children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ]),
  };

  componentDidMount() {
    React.findDOMNode(this.refs.dismiss).focus();
  }

    render() {
        return (<div className={classNames('modal-wrapper', this.props.modalClass)}>
          <div className='modal-bg' style={{opacity: this.props.modalBG ? 1 : 0}} onClick={this.props.modalOnClose}></div>
          <div className='modal'>
              {this.props.modalIMG}
              <h2>{this.props.modalTitle}</h2>
              {this.props.children}
              <button onClick={this.props.modalOnClose} ref='dismiss'>{this.props.modalCTA||'Dismiss'}</button>
              {this.props.introPage === null ? null : <div className='intro-bullets'>{[1,2,3].map(n => <div onClick={
                () => $(document).trigger([0, 'showZoomModal', 'generatedArrow', 'generatedND'][n], true)
              } className={classNames('intro-bullet', {active: this.props.introPage === n})} />)}</div>}
              {this.props.modalClose ? <button className='close' onClick={this.props.modalOnClose}><i className="fa fa-times"></i></button> : null}</div>
        </div>);
    }
}

window.nodes = _.clone(window.cc.standards);
// console.log('window.nodes => ', window.nodes);
window.parentNodes = _.pick(window.nodes, (s) => s.ordinal[1] !== '.');
// console.log('window.parentNodes => ', window.parentNodes);
window.parentNodeOf = function(node) { return  _.find(window.nodes, (s) => node.ccmathcluster_id === s.ccmathcluster_id && s.ordinal === node.ordinal.split('.')[0] ) };
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
_.forEach(window.nodes, (v, k) => {
    window.nodes[k].edge = [];
    window.nodes[k].nd_edge = [];
    window.nodes[k].rev_edge = [];
});
_.forEach(window.cc.edges, (e) => {
    window.nodes[e.from].edge.push(window.nodes[e.to]);
    window.nodes[e.to].rev_edge.push(window.nodes[e.from]);
});
_.forEach(window.cc.nd_edges, (e) => {
    window.nodes[e.from].nd_edge.push(window.nodes[e.to]);
});
/*_.forEach(window.nodes, (v, k) => {
    window.nodes[k].edge = _.sortBy(window.nodes[k].edge, (e) => require('./standards-utils').standardCode(e.id));
    window.nodes[k].rev_edge = _.sortBy(window.nodes[k].rev_edge, (e) => require('./standards-utils').standardCode(e.id));
});*/
// child connections
_.forEach(window.parentNodes, (n) => {
    //if(n.rev_edge.length > 0 || n.edge.length > 0 || n.nd_edge.length > 0) return;
    var children = _(window.nodes).pick( (s) => s.ccmathcluster_id === n.ccmathcluster_id && s.ordinal.indexOf(n.ordinal+'.')===0).values().value();

    //var mapToParents = function(edge) { return edge.map(window.parentNodeOf); }
    var mergeEdgeLists = function(edges, child_edges) {
      let _parentNode = child_edges.map(window.parentNodeOf);
      return _(edges.concat( _.sortBy(child_edges.map(window.parentNodeOf), 'id') )).uniq(false).value();
    }
    
    if (!children || (children && children.length === 0)) {
      n.edge.forEach( rev => rev.rev_edge = mergeEdgeLists(rev.rev_edge, [n]) );
      n.nd_edge.forEach( rev => 
        { 
          rev.nd_edge = mergeEdgeLists(rev.nd_edge, [n]);
        }
      );
    }
    let domain = getDomainByStandard(n.id);
    if (domain.grade !== 'HS') {
      children.forEach( c => {
        n.rev_edge = mergeEdgeLists(n.rev_edge, c.rev_edge);
        
          n.rev_edge.forEach( rev => {
            rev.edge = mergeEdgeLists(rev.edge, [n]) 
          });
          n.edge = mergeEdgeLists(n.edge, c.edge);
          n.edge.forEach( rev => rev.rev_edge = mergeEdgeLists(rev.rev_edge, [n]) );
          n.nd_edge = mergeEdgeLists(n.nd_edge, c.nd_edge).filter(nd => nd !== n);
          n.nd_edge.forEach( rev => 
            { 
              rev.nd_edge = mergeEdgeLists(rev.nd_edge, [n]);
            }
          );
    
      });
    }
    /*n.rev_edge = n.rev_edge.concat( _(children).values().map((c) => mapToParents(c.rev_edge)).flatten().sortBy('id').uniq(true).value() );
    _.forEach( _(children).values().map((c) => mapToParents(c.rev_edge)).flatten().sortBy('id').uniq(true).value() , (c) => c.edge.push(n));
    n.edge = n.edge.concat( _(children).values().map((c) => mapToParents(c.edge)).flatten().sortBy('id').uniq(true).value() );
    n.nd_edge = n.nd_edge.concat( _(children).values().map((c) => mapToParents(c.nd_edge)).flatten().sortBy('id').uniq(true).value() );
    _.forEach( _(children).values().map((c) => mapToParents(c.nd_edge)).flatten().sortBy('id').uniq(true).value() , (c) => c.nd_edge.indexOf(n) === -1 && c.nd_edge.push(n));*/
});

// Modeling tasks
window.cc.modeling_tasks = {};
window.cc.modeling_tasks.tasks = _.clone(window.cc.task);
window.cc.modeling_tasks.ela_course = _.clone(window.cc.ela_course);
window.cc.modeling_tasks.ela_subject = _.clone(window.cc.ela_subject);

var Graph = require('./graph');

var Header = require('./header');

class App extends React.Component {
  state = { panX:0, panY:0, dragging: false, grade: null, category: null, domain_cat: null, domain: null, standard: null, standard_index: null, root: null,
    seenArrowTip: false,
    seenDottedTip: false,
    seenZoomTip: false,
    spotlight: false,
    spotlightX: null,
    spotlightY: null,
    introPage: null,
    modal: false,
    courseInfoModal: false,
    modelingStandardModal: false,
    showModelingFrom: '',
    ModalLink: false,
    modalBG: false,
    modalClose: false,
    modalClass: '',
    modalTitle: null,
    modalChildren: null,
    modalCTA: null,
    landing: true,
    linkTo: null,
    newTab: false,
    showSpecialPage: null,
    modelingPage: null,
    modelingPageFrom: null,
   }
  dragOrigin = [0,0];

  savedModals = [];

  constructor(props) {
    super(props);
    //this.;
    //this.dragOrigin = [0,0];
    $(window).on('hashchange', (event) => {
      if(/#/.test(location.href))
        location.replace(location.href.replace('/#', '/'));
    });
    $(window).on('popstate', (event) => {
      const path_info = location.pathname.replace(/^\/(coherence-map|connections)?\/?/, '');
      if(window.ga) window.ga('send', 'pageview', location.pathname);
      var parts = path_info.split('/');
      parts[0] = parts[0] || null;
      parts[1] = parts[1] || null;
      parts[2] = parts[2] || null;
      parts[3] = parts[3] || null;
      parts[4] = 1*parts[4] || null;
      if (parts[0] && parts[0] === 'HS') {
        this.setState({grade:parts[0],
          category: parts[1],
          domain:parts[2],
          root:parts[3],
          standard:parts[4], standard_index:parts[5]});
        if (parts[1] && parts[1] === Config.modelingPage.landing) {
          //modelingPage
          let _stepModelingPage = Config.modelingPage.landing;//more-about, tasks
          if (parts[2]) {
            if (parts[2] === Config.modelingPage.moreAbout) {
              _stepModelingPage = Config.modelingPage.moreAbout;
              
            }
            if (parts[2] === Config.modelingPage.tasks) {
              _stepModelingPage = Config.modelingPage.tasks;
            }
          }
          this.setState({
            modelingPage: {
              step: _stepModelingPage,
            },
            showSpecialPage: {
              modeling: true
            }
          });
        }
      } else {
        this.setState({grade:parts[0],
          domain:parts[1],
          root:parts[2],
          standard:parts[3], standard_index:parts[4]});
      }
    });

  $(document).on('generatedArrow', (event, data) => {
    //if(this.state.seenArrowTip) return;
    //if(/ma=true/.test(document.cookie)) return;
    this.setState({seenArrowTip: true,
      introPage: 2,
      spotlight: false,
      modal: true,
      modalBG: true,
      modalIMG: <img src='/coherence-map/intro/map3.png'/>,
      modalTitle: 'Arrows',
      modalCTA: 'Next (2 of 3)',
      modalClose: false,
      modalClass: 'tip',
      modalChildren: [
        <h4 key='h'>An arrow (A->B) indicates related standards in cases where a student who cannot meet A is not likely to be able to meet B.</h4>,
        <p key='p1'>(Note, the arrow does not necessarily mean that A must be mastered before B, or that learning B is the immediate next step after learning A.)</p>
        ]
    });
  });
  $(document).on('generatedND', (event, data) => {
    //if(this.state.seenDottedTip) return;
    //if(/mnd=true/.test(document.cookie)) return;
    //if(this.state.modal) { this.savedModals = [['generatedND', data]]; return; }
    this.setState({seenDottedTip: true,
      introPage: 3,
      spotlight: false,
      modal: true,
      modalBG: true,
      modalIMG: <img src='/coherence-map/intro/map4.png'/>,
      modalTitle: 'Dashed Lines',
      modalCTA: 'Finish (3 of 3)',
      modalClose: false,
      modalClass: 'tip',
      modalChildren: [<h4 key='p1'>A dashed line (A---B) indicates related standards.</h4>,<p key='cookie'><label><input type='checkbox' defaultChecked={false} onChange={(e) => document.cookie = 'mz='+e.target.checked+'; expires=Fri, 31 Dec 9999 23:59:59 GMT'} /> Got it - don't show this to me again</label></p>]
    });
  });
  $(document).on('showZoomModal', (event, data) => {
    if(data) {
    }
    else {
      if(this.state.seenZoomTip) return;
      if (/mz=true/.test(document.cookie)) return;
      if (/bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex/i
        .test(navigator.userAgent)) return;
    }
    //if(this.state.modal) { this.savedModals.unshift(['showZoomModal', data]); return; }
    this.setState({seenZoomTip: true,
      introPage: 1,
      spotlightX: null,
      spotlightY: null,
      spotlight: false,
      modal: true,
      modalBG: true,
      modalIMG: <img src='/coherence-map/intro/zoom.png'/>,
      modalTitle: 'Explore the Map',
      modalCTA: 'Next (1 of 3)',
      modalClose: false,
      modalClass: 'tip',
      modalChildren: [<h4 key='p1'>Click on the magnifying glass to minimize the expanded standard card and explore the map.</h4>]
    });
  });
  $(document).on('defineTerm', (event, data) => {
    this.setState({
      introPage: null,
      modal: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: data.title,
      modalCTA: 'Dismiss',
      modalClose: true,
      modalClass: 'term',
      modalChildren: [<h4 key='p1'>{!data.desc.replace?data.desc:data.desc.replace('[3]', 'The properties of operations. Here a, b and c stand for arbitrary numbers in a given number system. The properties of operations apply to the rational number system, the real number system, and the complex number.') }</h4>,
      (data.desc.indexOf('[3]')>-1) ? <img src='/coherence-map/table3.png'/> : null
      ]
    });
  });
  $(document).on('defineLearnMore', (event, data) => {
    this.setState({
      introPage: null,
      courseInfoModal: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: data.title,
      modalCTA: data.cta ? data.cta : 'Learn more',
      modalClose: true,
      modalClass: 'term',
      modalChildren: [<h4 key='p1'>{!data.desc.replace?data.desc:data.desc.replace('[3]', 'The properties of operations. Here a, b and c stand for arbitrary numbers in a given number system. The properties of operations apply to the rational number system, the real number system, and the complex number.') }</h4>,
      (data.desc.indexOf('[3]')>-1) ? <img src='/coherence-map/table3.png'/> : null
      ]
    });
  });
  $(document).on('defineLearnMoreAboutModeling', (event, data) => {
    this.setState({
      introPage: null,
      modelingStandardModal: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: data.title,
      modalCTA: 'Learn More About Modeling',
      showModelingFrom: 'standard',
      modalClose: true,
      modalClass: 'term',
      modalChildren: [<h4 key='p1'>{!data.desc.replace?data.desc:data.desc.replace('[3]', 'The properties of operations. Here a, b and c stand for arbitrary numbers in a given number system. The properties of operations apply to the rational number system, the real number system, and the complex number.') }</h4>,
      (data.desc.indexOf('[3]')>-1) ? <img src='/coherence-map/table3.png'/> : null
      ]
    });
  });
  $(document).on('defineLink', (event, data) => {
    this.setState({
      introPage: null,
      ModalLink: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: data.title,
      modalCTA: data.modalCTA,
      linkTo: data.url,
      newTab: data.newTab,
      modalClose: true,
      modalClass: 'term',
      modalChildren: [<h4 key='p1'>{!data.desc.replace?data.desc:data.desc.replace('[3]', 'The properties of operations. Here a, b and c stand for arbitrary numbers in a given number system. The properties of operations apply to the rational number system, the real number system, and the complex number.') }</h4>,
      (data.desc.indexOf('[3]')>-1) ? <img src='/coherence-map/table3.png'/> : null
      ]
    });
  });
  $(document).on('showHelp', (event) => {
    this.setState({
      introPage: null,
      modal: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: 'Arrows',
      modalCTA: null,
      modalClose: true,
      modalClass: 'wide',
      modalChildren: [
        <h4 key='h'>An arrow (A->B) indicates related standards in cases where a student who cannot meet A is not likely to be able to meet B.</h4>,
        <p key='p1'>(Note, the arrow does not necessarily mean that A must be mastered before B, or that learning B is the immediate next step after learning A.)</p>,
      <h2>Dashed Lines</h2>,
      <h4 key='p2'>A dashed line (A---B) indicates related standards.</h4>,
      <h2>Major Cluster <span className='cluster-type m' /></h2>,
      <h4 key='p3'>This standard represents major work for this grade.</h4>,
      <h2>Supporting Cluster <span className='cluster-type s' /></h2>,
      <h4 key='p4'>This standard represents supporting work for this grade.</h4>,
      <h2>Additional Cluster <span className='cluster-type a' /></h2>,
      <h4 key='p5'>This standard represents additional work for this grade. As a reminder, 65-85% of instructional time over the course of the year should be focused on the major work of the grade, with grades K–2 nearer the upper end of that range.</h4>,
      <h4 key='p6' className='hideCTA far'>Connections are not shown between standards far from the mapped standard.</h4>,
      //<h2>Send feedback on the Coherence Map</h2>,
      //<h4>To send feedback on the Coherence Map, <a style={{color:'#2a7251'}} href="mailto:info@studentsachieve.net?subject=[Coherence%20Map]%20Feedback">click here.</a></h4>
      ]
    });
  });

  $(document).on('showHelpHS', (event) => {
    this.setState({
      introPage: null,
      modal: true,
      modalBG: true,
      modalIMG: null,
      modalTitle: 'Arrows',
      modalCTA: null,
      modalClose: true,
      modalClass: 'wide',
      modalChildren: [
        <h4 key='h'>Arrows: An arrow (A->B) indicates related standards in cases where a student who cannot meet A is not likely to beable to meet B.</h4>,
        <p key='p1'>(Note, the arrow does not necessarily mean that A must be mastered before B, or that learning B is the immediate next step after learning A.)</p>,
      <h2>Dashed Lines</h2>,
      <h4 key='p2' className='far-bottom'>A dashed line (A---B) indicates related standards.</h4>,
      <h2>Widely Applicable Pre-Requisite</h2>,
      <h4 key='p3'>WAP indicates wide applicability across a range of postsecondary work. Curricular materials, instruction, and assessment must give especially careful treatment to the these 
      standards, including their interconnections and their applications—amounting to a majority of students’ time.</h4>,
      <h2>Course Information</h2>,
      <h4 key='p4'>The course information displayed for each standard the course(s) in which the standard is typically addressed according to a review of 20 frameworks.</h4>,
      <h4 key='p5' className='hideCTA far-hs'>Connections are not shown between standards far from the mapped standard.</h4>,
      //<h2>Send feedback on the Coherence Map</h2>,
      //<h4>To send feedback on the Coherence Map, <a style={{color:'#2a7251'}} href="mailto:info@studentsachieve.net?subject=[Coherence%20Map]%20Feedback">click here.</a></h4>
      ]
    });
  });

  }

  componentWillMount() {
    $(window).trigger('hashchange');
    $(window).trigger('popstate');
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.grade !== this.state.grade || prevState.domain !== this.state.domain || prevState.root !== this.state.root) {
      $('html').addClass('animating');
      setTimeout(function() { $('html').removeClass('animating'); }, 551);
    }
  }


  // CLick button Introduce Modal
  onClickButtonModal = () => {
    $('html,body').animate({scrollTop:0});
    this.setState({
      courseInfoModal: false,
      showSpecialPage: {
        moreCourseInfo: true
      }
    });
  } 

  // CLick on 'Learn More About Modeling' button on Modeling Standards Overlay
  gotoModelingLandingPage = () => {
    // this._onSelectCat(Config.modelingPage.moreAbout);
    let _modelingPageFromObj = {
      grade: 'HS',
      root: this.state.root,
      domain: this.state.domain,
      standard: this.state.standard,
      category: this.state.category
    };
    this.setState({
      modelingStandardModal: false,
      showSpecialPage: {
        modeling: true
      },
      modelingPageFrom: _modelingPageFromObj
    });
    this._setHash({category: 'M', domain: null});
    // this._onSelectCat('M', Config.modelingPage.moreAbout);
  }

  _panTo = (x,y, noSroll = false) => {
    this.setState({
      panY: Math.floor(y*(LayoutStyle.CardHeight + LayoutStyle.PaddingV)),
      panX: Math.floor(x*(LayoutStyle.CardWidth + LayoutStyle.PaddingH)),
    });
    if (!noSroll) {
      $('html,body').animate({scrollTop:0});
    }
    
  }

  ie9MouseHax = false;

  onMouseDown = (e) => {
    if(this.isDetailLayout()) return;
    if('ontouchstart' in document && !e.touches) return;
    if(e.touches && e.touches.length===1) { e.buttons = 1; e.clientX = e.touches[0].clientX; e.clientY = e.touches[0].clientY; }
    if(e.buttons&1||e.buttons === undefined) {
      if(/MSIE 9|Intel.*Safari/.test(window.navigator.userAgent)) this.ie9MouseHax = true;
      this.dragOrigin = [e.clientX, e.clientY];
      this.panOrigin = [this.state.panX, this.state.panY];
    }
  }
  onMouseUp = (e) => {
      if(/MSIE 9|Intel.*Safari/.test(window.navigator.userAgent)) this.ie9MouseHax = false;
      if(this.isDetailLayout()) return;
      if('ontouchstart' in document && !e.touches) return;
      this.setState({dragging:false});
      var graphBounds = $('.graph .node').get().reduce(function(p,c) { var t = parseInt(c.style.top); var l = parseInt(c.style.left); return [Math.min(p[0], l), Math.max(p[1], l), Math.min(p[2], t), Math.max(p[3], t)]; }, [Infinity,-Infinity,Infinity,-Infinity]);
      if(this.state.panX < graphBounds[0]) this.setState({panX: graphBounds[0]});
      if(this.state.panX > graphBounds[1]) this.setState({panX: graphBounds[1]});
      if(this.state.panY < graphBounds[2]) this.setState({panY: graphBounds[2]});
      if(this.state.panY > graphBounds[3]) this.setState({panY: graphBounds[3]});
  }

  onMouseMove = (e) => {
    if(this.isDetailLayout()) return;
    if('ontouchstart' in document && !e.touches) return;
    if(e.touches && e.touches.length===1) { e.buttons = 1; e.clientX = e.touches[0].clientX; e.clientY = e.touches[0].clientY; }
    if(e.buttons&1||this.ie9MouseHax) {
      e.preventDefault();
      this.setState({dragging:true, panX: this.panOrigin[0] - e.clientX + this.dragOrigin[0], panY: this.panOrigin[1] - e.clientY + this.dragOrigin[1] });
    }
  }

  onClearGrade = (e) => {
    this.setState({landing: false, category:null, showSpecialPage: null});
    this._setHash({grade:null, category:null, domain:null, root: null, standard: null});
  }

  onClearCategory = (e) => {
    this.setState({landing: false, showSpecialPage: null});
    this._setHash({category:null, domain:null, root: null, standard: null});
  }

  onClearDomain = (e) => {
    this.setState({showSpecialPage: null});
    this._setHash({domain:null, root:null, standard: null});
  }

  onClearStandard = (e) => {
    this.setState({showSpecialPage: false});
    this._setHash({root:null, standard: null});
  }

  _setHash(stuff, domain = null) {
      this.setState({
        modelingPage : null
      });

      if (newHash && newHash.grade === 'HS' && newHash.domain && newHash.domain === 'M') {
        if (newHash.category && newHash.category === 'M') {
          this.setState({
            root: null, 
            standard: null,
            standard_index: null
          })
        }
      }
      var newHash = _.merge({}, this.state, stuff);
      if (domain) {
        newHash.domain = domain;
      }
      if (newHash.grade && newHash.grade !== 'HS') {
        newHash.category = null;
        this.setState({
          category: null, 
        })
      }

      var url;
      if (newHash && newHash.grade === 'HS') {
        if (newHash.category && newHash.category === 'M') {
          newHash.root = null;
          newHash.standard = null;
          newHash.standard_index = null
        }
        if (!newHash.category && newHash.domain && newHash.standard ) {
          let domain = window.cc.clusters[nodes[newHash.standard].ccmathcluster_id].ccmathdomain_id;
          newHash.category = domain.ordinal;
        }
        
        url = _.takeWhile([newHash.grade, newHash.category, newHash.domain, newHash.root, newHash.standard, newHash.standard_index], (c) => c !== null).join('/');
      } else {
        url = _.takeWhile([newHash.grade, newHash.domain, newHash.root, newHash.standard, newHash.standard_index], (c) => c !== null).join('/');
      }
      //location.hash = '#' + _.takeWhile([newHash.grade, newHash.domain, newHash.root, newHash.standard, newHash.standard_index], (c) => c!==null).join('/');
    // const url = _.takeWhile([newHash.grade, newHash.domain, newHash.root, newHash.standard, newHash.standard_index], (c) => c !== null).join('/');
    window.history.pushState(null, null, '/coherence-map/' + url);
    $(window).trigger('popstate');
  }

  isDetailLayout() {
      return this.state.standard !== null;
  }

  _onAdjustParentHeight = (height) => {
      var vp = this.refs.viewport;
      const { grade } = this.state;
      let minusHeightHs = 0;
      let sub_nav_hs = this.refs.sub_nav_hs;
      // $('.sub_nav_hs').show();
      if (grade === 'HS') {
        minusHeightHs = 60;
      }
      if(vp) {
        vp = vp.getDOMNode();
        if(height === null) {
            vp.style.height = 'auto';
            vp.style.top = '0';
            // $('.sub_nav_hs').hide();
        }
        else {
          height = Math.max(height, window.innerHeight/2);
          vp.style.height = 2*height + 'px';
          if(isOldMobileSafari) {
              vp.style.top = ((window.innerHeight/2 - height) + minusHeightHs) + 'px';
          }
          else {
              vp.style.top = 'calc(' + (-height + minusHeightHs) + 'px + 50vh)';
          }
        }
      }
      else {
        window.console && console.log('delayed height calc during initialization');
        setTimeout( () => this._onAdjustParentHeight(height), 10 );
      }
  }

  _onSelectDomain = (d) => {
    this._activeLoadingMap();
    this._setHash({domain:d})
  }
  _onSelectCat = (d) => {
    this._activeLoadingMap();
    this._setHash({category: d});
  }
  _onSelectModelingDomain = (d) => {
    // this._setHash({domain:d});
    this._setHash({category: d});
    this.setState({
      showSpecialPage: {
        modeling: true
      }
    });
  }
  _onSelectGrade = (g) => {
    this._activeLoadingMap();
    this._setHash({grade:g})
  }

  _activeLoadingMap() {
    window.loadingMap = true;
    setTimeout(() => {
      window.loadingMap = false;
    }, 300);
  }

  _onSelectInitialStandard = (s) => {
    var domain = window.cc.clusters[nodes[s].ccmathcluster_id].ccmathdomain_id;
    let grade = window.cc.domains[domain].grade;
    let _category = window.cc.domains[domain].ordinal.split('-')[0];
    if (grade === 'HS') {
      this._setHash({domain:domain, grade:window.cc.domains[domain].grade, category: _category, root:s,standard:s, standard_index: null});
    } else {
      this._setHash({domain:domain, grade:window.cc.domains[domain].grade, root:s,standard:s, standard_index: null});
    }
  }
  _onViewStandard = (s, i) => this._setHash({standard:s, standard_index:i})
  //_onMapStandard = (s) => this._setHash({root:s})

  _modalClose = () => {
    if(this.state.introPage !== null) {
      if(this.state.introPage === 1) { $(document).trigger('generatedArrow'); return; }
      if(this.state.introPage === 2) { $(document).trigger('generatedND'); return; }
    }
    this.setState({modal: false, spotlight: false});
    if(this.savedModals.length)
      setTimeout( () => { if(this.savedModals.length) { var m = this.savedModals.pop(); $(document).trigger(m[0],m[1]); return; } }, 500);

  }

  _courseInfoModalClose = () => {
    this.setState({courseInfoModal: false, spotlight: false});
  }

  _modelingStandardModalClose = () =>{
    this.setState({modelingStandardModal: false, spotlight: false});
  }

  _modalLinkClose = () => {
    if(this.state.introPage !== null) {
      if(this.state.introPage === 1) { $(document).trigger('generatedArrow'); return; }
      if(this.state.introPage === 2) { $(document).trigger('generatedND'); return; }
    }
      this.setState({ModalLink: false, spotlight: false});
      if(this.savedModals.length)
        setTimeout( () => { if(this.savedModals.length) { var m = this.savedModals.pop(); $(document).trigger(m[0],m[1]); return; } }, 500);

  }

  _clearSpecialPage = () => {
    this._setHash(this.state.modelingPageFrom);
    this.setState({
      showSpecialPage: null,
      modelingStandardModal: false
    })
  }

  selectedStepModeling = (_step) => {
    if (_step === 'mapped-standard') {
      this._clearSpecialPage();
      return;
    }
    if(this.state.modelingPage.step !== _step) {
      this.setState({
        modelingPage : { step: _step }
      });
      if (_step === 'landing') {
        this.setState({
          category : _step === 'landing' ? 'M' : _step
        });
      }
      
      this._onSelectDomain(_step === 'landing' ? null : _step);
    }
    $('html,body').animate({scrollTop:0});
  }

  _onGetStarted = (g) => { window.scrollTo(0, 1); this.setState({landing:false}); }


  render() {
    return (
      <div id="app" className={classNames({'detail-layout':this.isDetailLayout()})}>
        <Header 
          grade={this.state.grade} 
          category={this.state.category} 
          domain={this.state.domain} 
          standard={this.state.root} 
          onClearGrade={this.onClearGrade} 
          onClearCategory={this.onClearCategory}
          onClearDomain={this.onClearDomain} 
          onClearStandard={this.onClearStandard}
          showSpecialPage={this.state.showSpecialPage}
          root={this.state.root}
        />
        <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="modal">{(this.state.landing && !this.state.grade) ? <Landing key='landing' onGetStarted={this._onGetStarted} /> : null}</ReactCSSTransitionGroup>
        {(this.state.root || (this.state.landing && !this.state.grade)) 
          ? null 
          : <Deck 
            grade={this.state.grade} 
            category={this.state.category} 
            domain={this.state.domain} 
            onSelectGrade={this._onSelectGrade} 
            onSelectDomain={this._onSelectDomain} 
            onSelectCat={this._onSelectCat}
            onSelectModelingDomain={this._onSelectModelingDomain}
            showSpecialPage={this.state.showSpecialPage}
          />
        }

        {/* {(this.state.root || !this.state.category) ? null : <DesckHS grade={this.state.grade} domain={this.state.category} category={this.state.category}  onSelectGrade={this._onSelectGrade} onSelectDomain={this._onSelectDomain} />} */}

        {/* <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="domain">{(this.state.category && !this.state.root) ? <Domain key='domain' domain={'120'} onSelectStandard={this._onSelectInitialStandard} /> : null}</ReactCSSTransitionGroup> */}
        <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="domain">{(this.state.domain && !this.state.root && !this.state.modelingPage) ? <Domain key='domain' domain={this.state.domain} onSelectStandard={this._onSelectInitialStandard} /> : null}</ReactCSSTransitionGroup>
        {/* <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="domain">
          {( //!this.state.domain && !this.state.root && 
            this.state.showSpecialPage && this.state.showSpecialPage.modeling) ? 
            <Modeling key='domain' from={this.state.showModelingFrom} clearSpecialPage={ this._clearSpecialPage }/>
          : null}
        </ReactCSSTransitionGroup> */}
        <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={100} transitionName="course-info">
          {(
            this.state.showSpecialPage && this.state.showSpecialPage.moreCourseInfo) ? 
            <CourseInfomation key='course-info' clearSpecialPage={ this._clearSpecialPage }/>
          : null}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="viewport">{
          (this.state.root && !(this.state.showSpecialPage && (this.state.showSpecialPage.moreCourseInfo || this.state.showSpecialPage.modeling) ) ) ?
          <div>
            {
              (this.state.grade && this.state.grade === 'HS') ? 
                (<SubNavStandard />)
              : null
            }
            <div className='viewport' key='viewport' ref='viewport'
              onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}
              onTouchStart={this.onMouseDown.bind(this)} onTouchEnd={this.onMouseUp.bind(this)} onTouchMove={this.onMouseMove.bind(this)}
              >
              <div className="pan" style={{
                transform: 'translate(' + -this.state.panX + 'px, ' + -this.state.panY + 'px)',
                WebkitTransform: 'translate(' + -this.state.panX + 'px, ' + -this.state.panY + 'px)',
                msTransform: 'translate(' + -this.state.panX + 'px, ' + -this.state.panY + 'px)',
                transition: !this.state.dragging ? '0.5s transform ease': 'none',
                cursor: (!this.isDetailLayout() || this.state.dragging) ? 'move' : 'auto'
              }}>
                <Graph root={this.state.root} standard={this.state.standard} standard_index={this.state.standard_index} detailLayout={this.isDetailLayout()} onViewStandard={this._onViewStandard} onMapStandard={this._onSelectInitialStandard} panTo={this._panTo} onAdjustParentHeight={this._onAdjustParentHeight} />
              </div>
            </div>
          </div>
        : null
      }</ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="spotlight">{this.state.spotlight ? <Spotlight {..._.pick(this.state, (v,k)=>k.indexOf('spotlight')===0)} key='spotlight' /> : null }</ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="modal">
        {this.state.modal ? <Modal {..._.pick(this.state, (v,k)=>k.indexOf('modal')===0)} modalOnClose={this._modalClose} introPage={this.state.introPage} key='modal'>{this.state.modalChildren}</Modal> : null }</ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="modal">{this.state.courseInfoModal ? <CourseInfoModal {..._.pick(this.state, (v,k)=>k.indexOf('modal')===0)} modalOnClose={this._courseInfoModalClose} key='modal' onClickButtonModal={ this.onClickButtonModal }>{this.state.modalChildren}</CourseInfoModal> : null }</ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="modal">
        {this.state.ModalLink ? 
          <ModalLink {..._.pick(this.state, (v,k)=>k.indexOf('modal')===0)} 
            modalOnClose={this._modalLinkClose} key='modal' link={this.state.linkTo} 
            target={this.state.newTab}>{this.state.modalChildren}</ModalLink> : null }
      </ReactCSSTransitionGroup>

      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={0} transitionName="modeling-landing">
        {this.state.modelingPage && this.state.modelingPage.step ===  Config.modelingPage.landing ? 
          <ModelingLanding key='modeling-landing' 
            clearSpecialPage={ this._clearSpecialPage } 
            step={this.state.modelingPage.step}
            from={this.state.modelingPageFrom} 
            onSelectStep={this.selectedStepModeling} /> : null }
      </ReactCSSTransitionGroup>

      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={0} transitionName="modeling-more-about">
        {this.state.modelingPage && this.state.modelingPage.step ===  Config.modelingPage.moreAbout ? 
          <MoreAboutModeling key='modeling-more-about' 
            clearSpecialPage={ this._clearSpecialPage } 
            step={this.state.modelingPage.step}
            from={this.state.modelingPageFrom} 
            onSelectStep={this.selectedStepModeling} /> : null }
      </ReactCSSTransitionGroup>

      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={0} transitionName="modeling-tasks">
        {this.state.modelingPage && this.state.modelingPage.step ===  Config.modelingPage.tasks ? 
          <ModelingTasks key='modeling-tasks' 
            clearSpecialPage={ this._clearSpecialPage } 
            step={this.state.modelingPage.step}
            from={this.state.modelingPageFrom} 
            onSelectStep={this.selectedStepModeling} /> : null }
      </ReactCSSTransitionGroup>
      
      <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="modal">
        { this.state.modelingStandardModal ? 
        <ModelingStandardModal 
          {..._.pick(this.state, (v,k)=>k.indexOf('modal')===0)} 
          modalOnClose={this._modelingStandardModalClose} key='modal' 
          onClickButtonModal={ this.gotoModelingLandingPage }>
          {this.state.modalChildren}
        </ModelingStandardModal> : null }
      </ReactCSSTransitionGroup>
      </div>
    );
  }


}

if(window.innerWidth < 768) {
  $('meta[name="viewport"]')[0].setAttribute('content','width=768');
}

React.render(<App />, document.body);

require('./atc-modals');
