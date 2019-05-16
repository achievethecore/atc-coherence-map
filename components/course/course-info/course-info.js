import React, { Component } from 'react';
var ReactCSSTransitionGroup = require('timeout-transition-group');

// Components
import BreadcrumdCourse from '../breadcrumb-course/breadcrumd-course';
import MoreAboutCourse from '../course-info/more-about-course/more-about-course';

// Styles
import './course-info.scss';

class MoreCourseInfomation extends Component {
  state = {
    step: 'course-info'
  }

  selectedStep= (_step) => {
    if(_step === 'mapped-standard') {
      // this.setState({step: _step});
      this.props.clearSpecialPage();
      return;
    }
    if(this.state.step !== _step) {
      this.setState({step: _step});
    }
  }

  render() {
    return (
      <div className='domain-page'>
        <BreadcrumdCourse step={this.state.step} onSelectStep={this.selectedStep}/>
        <div className='course-info-wrapper'>
          <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={50} transitionName="course-info">
            {
              this.state.step === 'course-info' ?
                <MoreAboutCourse key='course-info' onSelectStep={this.selectedStep}/>
              : null
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

export default MoreCourseInfomation;