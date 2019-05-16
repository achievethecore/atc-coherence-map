var classNames = require('classnames');
var shallowEqual = require('react/lib/shallowEqual');

var ReactMeta = require('./reactmeta').ReactMeta;

import './scss/card.scss';

/* Config */
import { Config } from './config/app.config';

//var standardCode = require('./standards-utils').standardCode;

function layoutGrid(cards_length, containerWidth, cardWidth, cardHeight, padding, yBias) {
  var ps = [];
  var i = 0;
  var maxCols = (containerWidth / (cardWidth + padding));
  var y = yBias||0;
  while(i < cards_length) {
    var cols = Math.min(cards_length - i, Math.floor(maxCols));
    var x = -padding*0.5;
    x += 0.5*(cardWidth + padding) * (maxCols - cols);

    for(var col=0;col<cols;col++) {
      ps.push({x: x, y: y});
      x += cardWidth + padding;
      i++;
    }
    y += cardHeight + padding;
  }
  return ps;
}

function layoutStack(card_depths, spacing, center) {
  var totalStackDepth = _.sum( card_depths.map((c) => c + spacing ) ) - spacing;
  var stackPosition = center ? (-totalStackDepth/2) : 0 ;
  return card_depths.map( (c, i) => {
      var p = {x:-stackPosition, y:stackPosition};
      stackPosition += c + spacing;
      return p;
    }
  );
}

function getAllStandardsForDomain(d) {
  var clusters = _(window.cc.clusters).pick((c) => c.ccmathdomain_id===d).value();
  return _(window.cc.standards).pick((s) => !!clusters[s.ccmathcluster_id]).keys().value();
}

function getDepth(domain) {
  return getAllStandardsForDomain(domain.id).length;  //window.standards.filter((s) => s.id.indexOf(c+'.')>-1).length;
}


function domainCode(d) {
  return d.grade + '.' + d.ordinal;
}

function domainCodeHS(d, ordinalPrefix) {
  return d.grade + '.' + d.ordinal;
}

class Domain extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  state = {expanded: false};

  shouldComponentUpdate(nextProps, nextState) {
    return !( _.eq(nextProps, this.props) && _.eq(nextState, this.state) );
  }

  isExpanded() {
    return !this.props.shallow && this.state.expanded;
  }

  onDomainClick = () => {
    if(this.props.shallow) return;
    this.setState({expanded:false});
    if (this.props.domain.grade !== 'HS' && (this.props.grade && this.props.grade !== 'HS')) {
      this.props.onSelectDomain(this.props.domain.id);
    } else if((this.props.grade && this.props.grade === 'HS' && !this.props.category)){
      if (this.props.domain.ordinal === 'M') {
        this.props.onSelectModelingDomain(Config.modelingPage.landing);
      } else {
        this.props.onSelectCat(this.props.domain.ordinal);
      }
    } else {
      if (this.props.grade === 'HS' && 
        this.props.domain.ordinal && this.props.domain.ordinal === 'M') {
          this.props.onSelectModelingDomain(this.props.domain.id);
      } else {
        this.props.onSelectDomain(this.props.domain.id);
      }
    }
  }
  _onMouseEnter = () => {
    if (!window.loadingMap) {
      this.setState({expanded:true});
    }
    
  }

  render() {
    //var standards =window.standards.filter((s) => s.id.indexOf(this.props.domain+'.')>-1);
    var standards = getAllStandardsForDomain(this.props.domain.id);

    if (this.props.grade === 'HS') {
      if (!this.props.category) {
        if (this.props.domain.noStandard)  {
          // standards.push(1);
          standards = ["1", "2", "3"];
        } else {
          let ds = _(window.cc.domains).pick((d) => d.grade === 'HS' && d.ordinal.split('-') && 
          d.ordinal.split('-')[0] === this.props.domain.ordinalPrefix).sortBy('ordering').value();
          standards = _.map(ds, 'id');
        }
      } else {
        standards = getAllStandardsForDomain(this.props.domain.id);
      }
    }
    
    //if(this.props.shallow) standards = standards.slice(0,1);

    var expandedSpacing = 10;
    if(standards.length > 10) expandedSpacing = 5;
    var layouts = layoutStack(standards.map(() => 1), this.isExpanded() ? expandedSpacing : 0, !this.props.shallow).map( (p) => ({x: p.x + this.props.x, y: p.y + this.props.y }) );
    if(this.props.selectedDomain !== null)
      layouts = standards.map((p,i) => ({x:360,y:-680}));

    var gradeName = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade'].concat([4,5,6,7,8].map((n)=> n+'th Grade'));
    gradeName.push('High School');
    var classNameCard = 'card';
    if (this.props.domain.grade === 'HS') {
      classNameCard += ' card-hs';
    }
    return <div className="domain-cards" onClick={this.onDomainClick} onMouseEnter={()=>!('ontouchstart' in document) && this._onMouseEnter()} onMouseUp={()=>this.setState({expanded:false})} onMouseLeave={()=>this.setState({expanded:false})}>{standards.map( (s,i) =>
      <div style={{
        left:layouts[i].x,
        top:layouts[i].y,
        pointerEvents: (layouts[i].x===360&&layouts[i].y===-680)?'none':null,
        /* transform: 'translate(' +  Math.floor(layouts[i].x) + 'px,' + Math.floor(layouts[i].y) + 'px)', */
        zIndex: (this.isExpanded() ? 201 : 200 - this.props.depth)
        }} key={s} className={classNameCard}>{
      (this.props.shallow || (this.props.depth === 0 && i === 0))?
        (this.props.depth === 0 && i === 0) ?
          <div className="caption-container">
            <div className="grade-caption">
              { this.props.domain.grade !== 'HS' ? 
                gradeName[parseInt(this.props.domain.grade)||0]
              : gradeName[9]
              }
            </div>
            <div className="standard-caption">
              { this.props.grade !== 'HS' ?
                domainCode(this.props.domain)
                : !this.props.category ?
                  `HS.${this.props.domain.ordinal}` : domainCodeHS(this.props.domain, this.props.category)
              }
              <p>{this.props.domain.name}</p>
            </div>
          </div>
          :
          []
        :
        i === 0 ?
        <div className="caption-container">
          <div className="standard-caption">
            { this.props.grade !== 'HS' ?
              domainCode(this.props.domain)
              : !this.props.category ?
                `HS.${this.props.domain.ordinal}` : domainCodeHS(this.props.domain, this.props.category)
            }
            <p>{this.props.domain.name}</p>
          </div>
        </div>
        :
        []
      }</div>

    ).reverse()
    }</div>;

  }
}

class Grade extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  state = {expanded: false};

  _onClick = () => {
    this.setState({expanded:false}); if(this.props.selectedGrade === null) this.props.onSelectGrade(this.props.grade);
  }
  _onMouseEnter = () => this.setState({expanded:true});
  _onMouseLeave = () => this.setState({expanded:false});


  render() {
    //var domains =_.groupBy(standards.filter((s) => s.id.indexOf(this.props.grade+'.')>-1), (s) => s.id.split('.').slice(0,2).join('.') );
    var domains ;//= _(window.cc.domains).pick((d) => d.grade===''+this.props.grade).sortBy('ordering')/*.map((v) => v.grade+'.'+v.ordinal)*/.value();
    var object = window.cc.domains;
    var indexHS = 0;
    
    if (!this.props.category) {
      domains = _(window.cc.domains).pick((d) => d.grade===''+this.props.grade).sortBy('ordering')/*.map((v) => v.grade+'.'+v.ordinal)*/.value();
    } else {
      domains = _(window.cc.domains).pick((d) => d.grade === 'HS' && d.ordinal.split('-') && 
      d.ordinal.split('-')[0] === this.props.category).sortBy('ordering').value();
    }

    if (this.props.grade && this.props.grade === 'HS') {
      if (!this.props.category && Config.conceptual_categories) {
        domains = Config.conceptual_categories.items;
      }
    }
    var stacks = _(domains).map(getDepth).value();
    if (this.props.grade === 'HS' && !this.props.category) {
      
      stacks = [];
      Config.conceptual_categories.items.forEach(category => {
        if (category.ordinalPrefix === 'Modeling')  {
          stacks.push(1);
        } else {
          let ds = _(window.cc.domains).pick((d) => d.grade === 'HS' && d.ordinal.split('-') && 
          d.ordinal.split('-')[0] === category.ordinalPrefix).sortBy('ordering').value();
          stacks.push(_.size(ds));
        }
      });
    } else if (this.props.category) {
      stacks = [];
      let domainsByCategory =  _(window.cc.domains).pick((d) => d.grade === 'HS' && d.ordinal.split('-') && 
      d.ordinal.split('-')[0] === this.props.category).sortBy('ordering').value();
      domains = domainsByCategory;
      domainsByCategory.forEach(domain => {
        let standardsByDomain = getAllStandardsForDomain(domain.id);
        stacks.push(_.size(standardsByDomain));
      });
    }

    

    var shallow = this.props.selectedGrade === null;
    var selected = this.props.selectedGrade === this.props.grade;
    var { showSpecialPage } = this.props;

    var layouts;
    if(selected) {
      layouts = layoutGrid(stacks.length, 1200, 250, 160, 120, 80);
    }
    else if(!shallow) {
      layouts = stacks.map((p) => ({x:360,y:-680}));
    }
    else {
      layouts = layoutStack(stacks, this.state.expanded ? 10 : 0, true).map( (p) => ({x: p.x + this.props.x, y: p.y + this.props.y }));
      if (this.props.grade === 'HS' ) {
        for (var i = 0; i < layouts.length; i++) {
          layouts[i].x = layouts[i].x - 300;
          // alert(myStringArray[i]);
          //Do something
        }
      }
    }
    if (showSpecialPage) {
      layouts = stacks.map((p) => ({x:360,y:-680}));
    }
    return <div style={{
      pointerEvents: (!selected && !shallow)?'none':'auto',
    }}
    
    className={classNames('grade-cards', {'selected':selected, 
      'onHS': (!this.props.category && this.props.selectedGrade === 'HS' && selected), 
      'onCatHS': (this.props.selectedGrade === 'HS' && this.props.category) })} 
      onClick={this._onClick} 
      onMouseEnter={this._onMouseEnter} 
      onMouseLeave={this._onMouseLeave}>{domains.map( (d,i) =>
      <Domain 
        {...layouts[i]} 
        domain={d} grade={this.props.grade} 
        category={this.props.category} key={domainCode(d).replace(/\./g,',')} 
        depth={i} shallow={shallow} selectedDomain={this.props.selectedDomain} 
        onSelectDomain={this.props.onSelectDomain} onSelectCat={this.props.onSelectCat}
        onSelectModelingDomain={this.props.onSelectModelingDomain}
      />

    )
    }</div>;
    /*
    <div onMouseEnter=this.setState.expanded=true>
    Domains.map (c, i) =>

      <Domain {...layouts[i]} name=c.name height=c.getHeight zPosition=z expanded=false>*/

  }
}

export class Deck extends React.Component {x
  //state = {selectedGrade: null};
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  setTopPositionForDeskGrades(firstTime = false) {
    let wh = window.innerHeight;//$(window).height();
    $('.deck').removeClass('deck-default-top');
    if (this.props && (!this.props.grade && !this.props.category && !this.props.domain) && wh >= 760) {
      setTimeout(() => {
        let lastGradeCardEle = $('.grade-cards').last();
        let lastDomainCard = lastGradeCardEle.find('.domain-cards').last();
        let firstCardHs =  lastDomainCard.find('.card-hs').first();
        let posTopFirstCard = firstCardHs.position().top;
        let totalHeightGradeDesks = parseFloat(posTopFirstCard) + (141*2);
        let top = (wh - totalHeightGradeDesks)/2 - 12.5;
        $('.deck').animate({
          top: top,
        }, 100 );
  
      }, 800);
    } else {
      if (wh >= 760) {
        $('.deck').addClass('deck-default-top');
      } else {
        $('.deck').removeClass('deck-default-top');
      }
      
      $('.deck').css({'top': ''});
    }
    if (firstTime) {
      setTimeout(() => {
        if (wh > 300 && wh < 500) {
          $('.deck').addClass('deck-default-top');
          $('.deck').css({'top': '0px'});
        }
      }, 1000);
    } else {
      if (wh > 300 && wh < 500) {
        $('.deck').addClass('deck-default-top');
        $('.deck').css({'top': '0px'});
      }
    }
  }

  render() {
    let layouts;//layoutGrid(10, 1200, 160, 100, 145);
    let wh = window.innerHeight;//$(window).height();
    let distanceBetween2Rows;
    if (wh >= 760 && wh <= 840) {
      distanceBetween2Rows = 35;
    }
    if (wh > 840 && wh <= 980) {
      distanceBetween2Rows = 45;
    }
    if (wh > 980 && wh <= 1180) {
      distanceBetween2Rows = 65;
    }
    if (wh >= 760 && wh <= 1180) {
      layouts = layoutGrid(10, 1200, 160, distanceBetween2Rows, 145);
    } else {
      layouts = layoutGrid(10, 1200, 160, 100, 145);
    }
    this.setTopPositionForDeskGrades(true);

    window.onresize = () => {
      this.setTopPositionForDeskGrades();
    }

    return <div className='deck'>
      {(!this.props.domain || !this.props.grade) && <ReactMeta />}
      {
        ['K',1,2,3,4,5,6,7,8,'HS'].map((g, i) =>
          <Grade 
            {...layouts[i]} 
            category={this.props.category} 
            selectedCategory={this.props.category} 
            grade={g.toString()} 
            key={g} 
            selectedGrade={this.props.grade} 
            selectedDomain={this.props.domain} 
            onSelectGrade={this.props.onSelectGrade} 
            onSelectDomain={this.props.onSelectDomain} 
            onSelectCat={this.props.onSelectCat}
            onSelectModelingDomain={this.props.onSelectModelingDomain}
            showSpecialPage={this.props.showSpecialPage} 
          />
        )
        
    }
    </div>;
  }
}


/*
Domain
  <div topleft=expanded ? z*2 : z>



<Cards />
  <Grade name=K />
    <Domain name=K.NBT />
      */
