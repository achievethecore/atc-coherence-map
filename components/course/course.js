var Component = require('react').Component;
var classNames = require('classnames');

import { displayCourseResultsMethodology } from './../../helpers/utils';

/* Config */
import { Config } from './../../config/app.config';

// Styles
import './course.scss';

export default class Course extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive: window.courseInfoSelectedTab ? window.courseInfoSelectedTab : 'traditional'
    };
  }
  onChangeTab = (key) => {
    window.disableScrollTop = true;
    setTimeout(() => {
      window.disableScrollTop = false;
    }, 1000);
    window.courseInfoSelectedTab = key;
    this.setState({
      tabActive: key
    });
  }
  showCourseInfoOverlay = () => {
    window.disableScrollTop = true;
    setTimeout(() => {
      window.disableScrollTop = false;
    }, 1000);
    $(document).trigger('defineLearnMore', {title:'Course Information',desc:`Twenty frameworks were reviewed to investigate the course(s) in which this standard is typically
      addressed.`, url:'more-information', newTab: true, cta: 'Learn More about the Frameworks Reviewed' })
  }
  componentDidMount(){
    setTimeout(() => {
      window.courseInfoSelectedTab = null;
    }, 200);
  }

  componentWillUnmount() {
    window.disableScrollTop = false;
  }
  render() {
    const { standard } = this.props;
    return (
      <div className="course-information-wrap">
        <h3 className="course-information example-problem-header">Course Information</h3>
        <div className='course-information-help' onClick={this.showCourseInfoOverlay}><a className='button-help'>?</a></div>
        <ul className="tabs-header">
          <li className={ this.state.tabActive === 'traditional' ? 'active' : ''} 
            onClick={() => this.onChangeTab('traditional')}>
            TRADITIONAL
            <span className='tab-content'></span>
          </li>
          <li className={ this.state.tabActive === 'integrated' ? 'active' : ''} 
            onClick={() => this.onChangeTab('integrated')}>
            INTEGRATED
            <span className='tab-content'></span>
          </li>
        </ul>
        <div className="tabs-section">
          <div className={ this.state.tabActive !== 'traditional' ? 'integrated-section display-none' : 'integrated-section'}>
            <ul className='course-info-body'>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_a1).highlight })} >
                <span className='col-left'>Algebra 1:</span>
                <span className='col-right'><strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_a1).text }</strong> of the frameworks consulted addressed this standard.</span>
              </li>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_g).highlight })}>
                <span className='col-left'>Geometry:</span>
                <span className='col-right'><strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_g).text }</strong> of the frameworks consulted addressed this standard.</span>
              </li>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_a2).highlight })}>
                <span className='col-left'>Algebra 2:</span>
                <span className='col-right'><strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_a2).text }</strong> of the frameworks consulted addressed this standard.</span>
              </li>
            </ul>
            
            {/* <table className='course-info-body' border="0" cellSpacing="0" cellPadding="0">
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_a1).highlight })}>
                <td className="col-left">Algebra 1:</td>
                <td>
                  <strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_a1).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_g).highlight })}>
                <td className="col-left">Geometry:</td>
                <td>
                  <strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_g).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.traditional_course_frameworks_a2).highlight })}>
                <td className="col-left">Algebra 2:</td>
                <td> 
                  <strong>{ displayCourseResultsMethodology(standard.traditional_course_frameworks_a2).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
            </table> */}
          </div>
          <div className={ this.state.tabActive !== 'integrated' ? 'integrated-section display-none' : 'integrated-section'}>
            <ul className='course-info-body'>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m1).highlight })}>
                <span className="col-left">Math 1:</span>
                <span className="col-right">
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m1).text }</strong> of the frameworks consulted addressed this standard.
                </span>
              </li>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m2).highlight })}>
                <span className="col-left">Math 2:</span>
                <span className="col-right">
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m2).text }</strong> of the frameworks consulted addressed this standard.
                </span>
              </li>
              <li className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m3).highlight })}>
                <span className="col-left">Math 3:</span>
                <span className="col-right">
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m3).text }</strong> of the frameworks consulted addressed this standard.
                </span>
              </li>
            </ul>
            {/* <table className='course-info-body'>
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m1).highlight })}>
                <td className="col-left" width='85px'>Math 1:</td>
                <td>
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m1).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m2).highlight })}>
                <td className="col-left">Math 2:</td>
                <td>
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m2).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
              <tr className={classNames({ 'many': displayCourseResultsMethodology(standard.integrated_course_frameworks_m3).highlight })}>
                <td className="col-left">Math 3:</td>
                <td>
                  <strong>{ displayCourseResultsMethodology(standard.integrated_course_frameworks_m3).text }</strong> of the frameworks consulted addressed this standard.
                </td>
              </tr>
            </table> */}
          </div>
        </div>
      </div>
    );
  }
}
