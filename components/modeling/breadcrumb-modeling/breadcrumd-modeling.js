import React, { Component } from 'react';
import './breadcrumd-modeling.scss';

class BreadcrumdModeling extends Component {

  render() {
    var { step, onSelectStep, from } = this.props;
    var breadcrumdName;
    var backToStep;
    switch (step) {
      case 'tasks':
        breadcrumdName = 'Modeling Homepage';
        backToStep = 'landing';
        break;
      case 'more-about':
        breadcrumdName = 'Modeling Homepage';
        backToStep = 'landing';
        break;
    
      default:
        breadcrumdName = 'Modeling Homepage';
        backToStep = 'landing';
        break;
    }
    if ((step === 'M') && from && from.category) {
      breadcrumdName = 'Back to Mapped Standard';
      backToStep = 'mapped-standard';
    }
    return (
      <div className='breadcrumd-modeling'>
        <span className="arrow" onClick={() => onSelectStep(backToStep)}>{''}</span>
        <span className='breadcrumd-name' onClick={() => onSelectStep(backToStep)}>{breadcrumdName}</span>
      </div>
    )
  }
}

export default BreadcrumdModeling;