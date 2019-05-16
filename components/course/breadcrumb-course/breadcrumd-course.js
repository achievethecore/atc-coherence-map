import React, { Component } from 'react';
import './breadcrumd-course.scss';

class BreadcrumdCourse extends Component {

  render() {
    const { step, onSelectStep } = this.props;
    let breadcrumdName;
    let backToStep;
    switch (step) {
      // case 'more-about':
      //   breadcrumdName = 'Back to Mapped Standard';
      //   backToStep = 'mapped-standard';
      //   break;
    
      default:
        breadcrumdName = 'Back to Mapped Standard';
        backToStep = 'mapped-standard';
        break;
    }
    return (
      <div className='breadcrumd-course'>
        <span className="arrow" onClick={() => onSelectStep(backToStep)}>{''}</span>
        <span className='breadcrumd-name' onClick={() => onSelectStep(backToStep)}>{breadcrumdName}</span>
      </div>
    )
  }
}

export default BreadcrumdCourse;