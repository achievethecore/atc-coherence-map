import React, { Component } from 'react';

import BreadcrumdModeling from '../breadcrumb-modeling/breadcrumd-modeling';

// Styles
import '../../../scss/modeling.scss';
import './modeling-landing.scss';

class ModelingLanding extends Component {
  render() {
    const { onSelectStep } = this.props;

    return (
      <div className='domain-page'>
        {(this.props && this.props.step !== 'M') || this.props && (this.props.from && this.props.from.category)
          ? <BreadcrumdModeling step={this.props.step} onSelectStep={onSelectStep} from={this.props.from} />
          : null
        }
        <div className='modeling-wrapper'>
          <div className='modeling-container modeling-landing-page'>
            <h2 className="landing-page-name">Modeling</h2>
            <div className="rows">
              <div className="col-2 col-left">
                <h3>What is Modeling?</h3>
                <div className="content">
                  <p>
                    College- and career-ready standards give modeling extra emphasis in high school for good reasons. Modeling is the link between the mathematics students learn in school and the problems they will face in college, career, and life. Time spent on modeling in high school is crucial as it prepares students to use math to handle technical subjects in their further studies, and problem solve and make decisions that adults need to make regularly in their lives.
                  </p>
                  <p className="modeling-cycle">
                    The modeling cycle as represented on page 72 of the <a href="http://www.corestandards.org/wp-content/uploads/Math_Standards1.pdf" target="_blank">CCSS</a>:
                  </p>
                  <img src='/coherence-map/images/icon/modeling-cycle.svg' title="" alt=""/>
                </div>
                <div className="node">
                  <button className="button" onClick={() => this.props.onSelectStep('more-about')}>Learn More About Modeling</button>
                </div>
              </div>
              <div className="col-2 col-right">
                <h3>Modeling Tasks</h3>
                <div className="content">
                  <p>
                    Modeling tasks can be found in two locations on the Coherence Map depending on whether they are categorized as low-, medium-, or high-intensity.
                    
                    <ul>
                      <li>Low-intensity modeling tasks require a short amount of time, often represent a subset of the stages of the modeling cycle, and are easily tagged to a particular standard; these tasks appear as example tasks under specific modeling content standards ★.</li>
                      <li>Medium- and high-intensity modeling tasks can range from a short amount of time to multiple days, can represent many or all of the stages of the modeling cycle, and are tagged more closely to the conceptual category of modeling than to any particular standard or group of standards.</li>
                    </ul>
                  </p>
                </div>
                <div className="node">
                  <button className="button" onClick={() => this.props.onSelectStep('tasks')}>View Modeling Tasks</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default ModelingLanding;