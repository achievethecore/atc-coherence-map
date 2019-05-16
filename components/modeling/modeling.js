import React, { Component } from 'react';
var ReactCSSTransitionGroup = require('timeout-transition-group');
import BreadcrumdModeling from '../modeling/breadcrumb-modeling/breadcrumd-modeling';
import ModelingLanding from '../modeling/modeling-landing/modeling-landing';
import MoreAboutModeling from '../modeling/more-about-modeling/more-about-modeling';
import ModelingTasks from '../modeling/modeling-tasks/modeling-tasks';
import './modeling.scss';

class Modeling extends Component {
  state = {
    step: 'landing'
  }
  selectedStep= (_step) => {
    if (_step === 'mapped-standard') {
      this.props.clearSpecialPage();
      return;
    }
    if(this.state.step !== _step) {
      this.setState({step: _step});
    }
    $('html,body').animate({scrollTop:0});
  }
  render() {
    const { from } = this.props;
    return (
      <div className='domain-page'>
        { (this.state && this.state.step !== 'landing') || from === 'standard'
          ? <BreadcrumdModeling step={this.state.step} onSelectStep={this.selectedStep} from={from} />
          : null
        }
        <div className='modeling-wrapper'>
          <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="landing">
            {
              this.state.step === 'landing' ?
              <ModelingLanding key='landing' onSelectStep={this.selectedStep}/>
              : null
            }
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="more-about">
            {
              this.state.step === 'more-about' ?
              <MoreAboutModeling key='more-about' onSelectStep={this.selectedStep}/>
              : null
            }
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup enterTimeout={500} leaveTimeout={300} transitionName="tasks">
            {
              this.state.step === 'tasks' ?
              <ModelingTasks key='tasks' onSelectStep={this.selectedStep}/>
              : null
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default Modeling;