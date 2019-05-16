var Component = require('react').Component;
var shallowEqual = require('react/lib/shallowEqual');
var classNames = require('classnames');

var formatHTML = require('./standards-utils').formatHTML;

export class ClusterName extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  static propTypes = {
    name: React.PropTypes.string.isRequired,
  }

  render() {
    return (<p className='cluster-desc' dangerouslySetInnerHTML={{__html:formatHTML(this.props.name)}}></p>);
  }
}

export class ClusterDesc extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  static propTypes = {
    msa: React.PropTypes.string.isRequired,
    grade: React.PropTypes.string.isRequired,
    wap: React.PropTypes.string,
  }

  render() {

    var msa_class = ['m','s','a'][1*this.props.msa];
    var msa_text = ['Major','Supporting','Additional'][1*this.props.msa] + ' Cluster';

    var msa_desc = [
    'This standard represents major work for this grade. As a reminder, 65-85% of instructional time over the course of the year should be focused on the major work of the grade',
    'This standard represents supporting work for this grade. As a reminder, 65-85% of instructional time over the course of the year should be focused on the major work of the grade',
    'This standard represents additional work for this grade. As a reminder, 65-85% of instructional time over the course of the year should be focused on the major work of the grade'][1*this.props.msa];

    if(this.props.grade === 'K' || this.props.grade === '1' || this.props.grade === '2') {
        msa_desc += ', with grades K–2 nearer the upper end of that range.';
    }
    else {
        msa_desc += '.';
    }

    if(this.props.grade === 'HS') {
      // if(1*this.props.wap !== 0) return null;
      msa_desc = 'A Widely Applicable Prerequisite (WAP) standard is one with relatively wide applicability across a range of postsecondary work. The Widely Applicable Prerequisites are a subset of the material students must study to be college and career ready (CCSSM, pp. 57, 84). Curricular materials, instruction, and assessment must give especially careful treatment to the domains, clusters, and standards identified as a WAP, including their interconnections and their applications—amounting to a majority of students’ time.';
      msa_text = 'Widely Applicable Prerequisite';
      msa_class = 'wap';
      if (this.props.wap === '1') {
        return null;
      }
      if (this.props.standards) {
        let standardNoWap = _.map(this.props.standards, function(s) {
          if (s.wap === '1') return s;
        });
        standardNoWap = _.without(standardNoWap, undefined);
        if (standardNoWap && standardNoWap.length > 0) {
          return null;
        }
      }
    }

    return (<div onClick={() => $(document).trigger('defineTerm', {title:msa_text,desc:msa_desc})} className={classNames('cluster-type', msa_class)}><span>{msa_text}</span></div>);
  }
}
