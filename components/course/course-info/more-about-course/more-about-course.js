import React, { Component } from 'react';

// Styles
import './more-about-course.scss';

class MoreAboutCourse extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => {
      // Scroll
      let id = 'framworks-reviewed';
      $('html,body').animate({
        scrollTop: $("#" + id).offset().top - 75
      }, 'slow');
    }, 500);
    
  }

  render() {
    return (
      <div className='course-info-container'>
        <div className="course-info-more-about-page">
          <h2 className="page-name">More on High School Courses</h2>
          
          <div className="content">
            <p>
              The Common Core State Standards (CCSS) for Mathematics are organized by grade level in Grades
              K–8. At the high school level, the standards are organized by conceptual category (Number and Quantity,
              Algebra, Functions, Modeling, Geometry, and Statistics and Probability), showing the body of knowledge
              students should learn in each category to be college- and career-ready and to be prepared to study more
              advanced mathematics. An important consideration in implementation of the high school standards is how
              they might be organized into courses that provide a strong foundation for post-secondary success.
            </p>
            <p>
              High schools most often organize the standards through one of two pathways: Traditional - Algebra 1,
              Geometry, Algebra 2 or Integrated - Math 1, Math 2, Math 3.
            </p>

            <h2 className="page-name" id='framworks-reviewed'>Frameworks Reviewed</h2>
            <p>In the summer of 2018, Student Achievement Partners consulted the following frameworks to investigate
what course(s) each standard is typically addressed in.</p>

            <table>
              <tr className="heading">
                <th width="50%">Traditional Pathway</th>
                <th width="50%">Integrated Pathway</th>
              </tr>
              <tr>
                <td>PARCC Model Content Frameworks (2017)</td>
                <td>PARCC Model Content Frameworks (2017)</td>
              </tr>
              <tr>
                <td>New Jersey Curricular Frameworks (2014)</td>
                <td>California Mathematics Framework (2013)</td>
              </tr>
              <tr>
                <td>California Mathematics Framework (2013)</td>
                <td>North Carolina Standard Course of Study (2017)</td>
              </tr>
              <tr>
                <td>CCSS Appendix A (2010)</td>
                <td>CCSS Appendix A (2010)</td>
              </tr>
              <tr>
                <td>CPM Educational Program Content Correlations
                (2013)</td>
                <td>CPM Educational Program Content Correlations
                (2013)</td>
              </tr>

              <tr>
                <td>Massachusetts Curriculum Framework (2017)</td>
                <td>Colorado CMAS Level Descriptors (2017)</td>
              </tr>
              <tr>
                <td>Illustrative Mathematics HS Curriculum Blueprint
                (2018)</td>
                <td>Ohio DOE State Test Blueprints (2018)</td>
              </tr>
              <tr>
                <td>Agile Minds Standards Alignment (2016)</td>
                <td></td>
              </tr>
              <tr>
                <td>Florida Standards Assessment Blueprints (2017)</td>
                <td></td>
              </tr>
              <tr>
                <td>New York State Next Generation Mathematics
                Learning Standards (2017)</td>
                <td></td>
              </tr>
              <tr>
                <td>Eureka Math Curriculum Overview (2015)</td>
                <td></td>
              </tr>
              <tr>
                <td>Ohio DOE State Test Blueprints (2018)</td>
                <td></td>
              </tr>
              <tr>
                <td>Louisiana Student Standards:Companion
                Document for Teachers 2.0 (2018)</td>
                <td></td>
              </tr>
            </table>

            <h2 className="page-name">Results</h2>
            <p>The Coherence Map displays the results of this review using the following methodology.</p>
            <p>
              <strong>All or almost all:</strong><span> More than 89% of the frameworks consulted addressed this standard.<br></br></span>
              <strong>Most:</strong><span> 64-89% of the frameworks consulted addressed this standard.<br></br></span>
              <strong>Some:</strong><span> 20-63% of the frameworks consulted addressed this standard.<br></br></span>
              <strong>Few or None:</strong><span> Less than 20% of the frameworks consulted addressed this standard.<br></br></span>
            </p>

            <p>The course designations in the Coherence Map do not mandate what course a standard should be addressed in. They are provided to offer a picture of where each standard is targeted in the frameworks reviewed. Educators should consult district and/or state guidance for content coverage for high school courses and assessments. </p>

            {/* <div className="node">
              <a className="button" href="#" target="_blank">View More <i className="icon-down rotate"></i></a>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default MoreAboutCourse;