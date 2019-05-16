var Component = require('react').Component;
var shallowEqual = require('react/lib/shallowEqual');

export default class Landing extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  static propTypes = {
    onGetStarted: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    $('.landing .scroll').hide().fadeIn();
    $(window).on('scroll', () => $('.landing .scroll').fadeOut());
  }

  render() {

    return (
    <div className='landing'>
      <div className='scroll'><i className='fa fa-angle-down' /></div>
      <div className='landing-hero'></div>
      <div className='landing-mod-1 landing-box'>
        <p>The Coherence Map shows the connections between Common Core State Standards for{'\xA0'}Mathematics.</p>
        <button onClick={this.props.onGetStarted}>Get Started</button>
      </div>
      <div className='landing-mod-2'>
        <div className='landing-triplet landing-box'>Build student understanding by linking together concepts within and across grades.</div>
        <div className='landing-triplet landing-box'>Identify gaps in a student's knowledge by tracing a standard back through its logical pre-requisites.</div>
        <div className='landing-triplet landing-box'>Visualize and understand how supporting standards relate to the major work of the grade.</div>
      </div>
      <div className='landing-mod-3 landing-box'>
        <h2>Mathematics standards are not isolated concepts.</h2>
        <p>Standards relate to one another, both within and across grades. The Coherence Map illustrates the coherent structure that is fundamental to college- and career-ready standards.</p>
        <img src='/coherence-map/intro/map2.png' />
      </div>
      <div className='landing-mod-5 landing-box'>
        <img src='/coherence-map/intro/map5.png' />
        <img src='/coherence-map/intro/map6.png' />
        <h2>Standards are illustrated with tasks, lessons, and assessments, as well as excerpts from the Progressions documents.</h2>
      </div>
      <div className='landing-mod-6'>
        <button onClick={this.props.onGetStarted}>Get Started</button>
      </div>
      <div className='footer'>
        <div className='footer-top'>
        <div className='left'>
          <a href='//achievethecore.org' target="_blank"><img src='//achievethecore.org/static/img/logo-sap.svg' alt='Student Achievement Partners' width='140' /></a>
          <a href='//achievethecore.org' target="_blank">achievethecore.org</a>
          <h3>Sign Up To Receive Updates</h3>
          <form className="signup">
  							<input type="text" id="email-updates" name="email-updates" placeholder="Email Address" />
  				</form>
        </div>
        <div className='right'>
            <a href='https://achievethecore.org/contact-us' target='_blank'>Contact Us</a>
            <a href='https://achievethecore.org/about-us' target='_blank'>About Us</a>    
            <a href='https://github.com/achievethecore' target='_blank'>For Developers</a>
            <a className="feedback" href='#' target='_blank'>Send Feedback</a>
            <p>achievethecore.org’s digital tools and resources for teachers have been made possible by contributions from teachers across the country as well as through generous support from the Leona M. and Harry B. Helmsley Charitable Trust and the GE Foundation.</p>  
        </div>
        </div>  
        <div className='footer-bottom'>
          <ul className="footer-policies">
  							<li><a href="/privacy-policy">Privacy Statement</a></li>
  							<li><a href="/terms-of-use">Terms of Use</a></li>
  							<li><a href="/ccpd">Permissions</a></li>
          </ul>
          <ul className="footer-social">
  							<li><a href="https://twitter.com/achievethecore" target="_blank">Twitter</a></li>
  							<li><a href="http://pinterest.com/achievethecore/boards/" target="_blank">Pinterest</a></li>
  							<li><a href="https://www.facebook.com/AchievetheCore/" target="_blank">Facebook</a></li>
  					</ul>
        </div>  
      </div>
    </div>);
  }
}
