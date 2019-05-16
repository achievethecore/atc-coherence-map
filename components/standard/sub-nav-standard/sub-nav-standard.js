import React, { Component } from 'react';

// Styles
import './sub-nav-standard.scss';

class SubNavStandard extends Component {
  render() {
    return (
      <div className='sub_nav_hs'>
        <p>
          <span>High School content standards mapped with</span>
          <a onClick={() => $(document).trigger('defineLink', {
            title: 'UnboundEd', 
            desc: `High school content standard connections in the Coherence Map were produced in 
              collaboration with our partners at UnboundEd. The education experts and thought 
              leaders at UnboundEd are committed to helping students meet the challenges of higher 
              standards through equitable instructional practices essential for closing the 
              opportunity gap caused by systemic bias and racism. For more information about 
              UnboundEd and access to free, high-quality standards-aligned resources for the 
              classroom, go to https://www.unbounded.org/.`, 
            modalCTA: 'Visit UnboundEd.org',
            url: 'https://www.unbounded.org/',
            newTab: true})}>UnboundEd</a>
        </p>
      </div>
    )
  }
}

export default SubNavStandard;