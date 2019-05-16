import React, { Component } from 'react';
import BreadcrumdModeling from '../breadcrumb-modeling/breadcrumd-modeling';

/* Services */
import { httpService } from './../../../services/http.service';

// Styles
import '../../../scss/modeling.scss';
import './more-about-modeling.scss';

class MoreAboutModeling extends Component {
  constructor(props) {
    super(props);
    this.player = null;
    this.videoId = 5249;
    this.videoURLDownload = `https://achievethecore.org/file/${this.videoId}`;
  }

  state = {
    isPlaying: false,
    videoDownloadCount: 0
  }

  componentDidMount() {
    let vimeo = window.Vimeo;
    var options = {
      url: 'https://player.vimeo.com/video/315492350',
      width: 540,
      height: 406
    };

    this.player = new Vimeo.Player('iframe-video', options);

    // this.player.setVolume(0);
    // this.player.on('play', function() {
    //   console.log('played the video!');
    // });

    // get content of video file from database
    httpService._get(`https://achievethecore.org/standards-admin/get_content_api.php?id=${this.videoId}`)
      .then(res => {
        this.setState({
          videoDownloadCount: res.data.downloadcount
        })
      })
      .catch( (error) => {
        console.log('error => ', error);
      });
  }

  _playerPlay = () => {
    if (this.state.isPlaying) this.player.pause();
    else this.player.play();
    
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }

  downloadVideo = () => {
    this.setState({
      videoDownloadCount: parseInt(this.state.videoDownloadCount) + 1
    })
  }

  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }


  render() {
    const { onSelectStep } = this.props;

    return (
      <div className='domain-page'>
        {(this.props && this.props.step !== 'landing') || this.props && (this.props.from && this.props.from.category)
          ? <BreadcrumdModeling step={this.props.step} onSelectStep={onSelectStep} from={this.props.from} />
          : null
        }
        <div className='modeling-wrapper'>
          <div>
            <div className='modeling-container'>
              <div className="modeling-more-about-page">
                <h2 className="page-name">More About Modeling</h2>
                
                <div className="content">
                  <p>
                    Making mathematical models is a Standard for Mathematical Practice in all grades and a Conceptual Category in the Standards for Mathematical Content for high school. In addition, specific modeling standards appear throughout the high school content standards indicated by a star symbol ★.
                  </p>
                  <h3>What is Modeling?</h3>
                  <p>
                    Modeling links classroom mathematics and statistics to everyday life, work, and decision-making. Modeling is the process of choosing and using appropriate mathematics and statistics to analyze empirical situations, to understand them better, and to improve decisions. Quantities and their relationships in physical, economic, public policy, social, and everyday situations can be modeled using mathematical and statistical methods. When making mathematical models, technology is valuable for varying assumptions, exploring consequences, and comparing predictions with data. 
                  </p>
                  <p>
                    A model can be very simple, such as writing total cost as a product of unit price and number bought, or using a geometric shape to describe a physical object like a coin. Even such simple models involve making choices. It is up to us whether to model a coin as a three-dimensional cylinder, or whether a two dimensional disk works well enough for our purposes. Other situations—modeling a delivery route, a production schedule, or a comparison of loan amortizations—need more elaborate models that use other tools from the mathematical sciences. Real-world situations are not organized and labeled for analysis; formulating tractable models, representing such models, and analyzing them is appropriately a creative process. Like every such process, this depends on acquired expertise as well as creativity. Some examples of such situations might include: 
                  
                  </p>

                  <ul>
                    <li>
                      Estimating how much water and food is needed for emergency relief in a devastated city of 3 million people, and how it might be distributed.
                    </li>
                    <li>
                      Planning a table tennis tournament for 7 players at a club with 4 tables, where each player plays against each other player.
                    </li>
                    <li>
                      Designing the layout of the stalls in a school fair so as to raise as much money as possible.
                    </li>
                    <li>
                      Analyzing stopping distance for a car.
                    </li>
                    <li>
                      Modeling savings account balance, bacterial colony growth, or investment growth.
                    </li>
                    <li>
                      Engaging in critical path analysis, e.g., applied to turnaround of an aircraft at an airport.
                    </li>
                    <li>
                      Analyzing risk in situations such as extreme sports, pandemics, and terrorism.
                    </li>
                    <li>
                      Relating population statistics to individual predictions. 
                    </li>
                  </ul>
                  <p>
                    In situations like these, the models devised depend on a number of factors: How precise an answer do we want or need? What aspects of the situation do we most need to understand, control, or optimize? What resources of time and tools do we have? The range of models that we can create and analyze is also constrained by the limitations of our mathematical, statistical, and technical skills, and our ability to recognize significant variables and relationships among them. Diagrams of various kinds, spreadsheets and other technology, and algebra are powerful tools for understanding and solving problems drawn from different types of real-world situations. 
                  </p>
                  <p>
                    One of the insights provided by mathematical modeling is that essentially the same mathematical or statistical structure can sometimes model seemingly different situations. Models can also shed light on the mathematical structures themselves, for example, as when a model of bacterial growth makes more vivid the explosive growth of the exponential function.
                  </p>

                  <img src='/coherence-map/images/icon/modeling-cycle.svg' title="" alt=""/>

                  <p>The basic modeling cycle is summarized in the diagram. It involves (1) identifying variables in the situation and selecting those that represent essential features, (2) formulating a model by creating and selecting geometric, graphical, tabular, algebraic, or statistical representations that describe relationships between the variables, (3) analyzing and performing operations on these relationships to draw conclusions, (4) interpreting the results of the mathematics in terms of the original situation, (5) validating the conclusions by comparing them with the situation, and then either improving the model or, if it is acceptable, (6) reporting on the conclusions and the reasoning behind them.</p>

                  <h3>Choices, assumptions, and approximations are present throughout this cycle.</h3>
                  <p>
                    In descriptive modeling, a model simply describes the phenomena or summarizes them in a compact form. Graphs of observations are a familiar descriptive model—for example, graphs of global temperature and atmospheric CO<sub>2</sub> over time. 
                  </p>
                  <p>
                    Analytic modeling seeks to explain data on the basis of deeper theoretical ideas, albeit with parameters that are empirically based; for example, exponential growth of bacterial colonies (until cut-off mechanisms such as pollution or starvation intervene) follows from a constant reproduction rate. Functions are an important tool for analyzing such problems. 
                  </p>
                  <p>
                    Graphing utilities, spreadsheets, computer algebra systems, and dynamic geometry software are powerful tools that can be used to model purely mathematical phenomena (e.g., the behavior of polynomials) as well as physical phenomena. 
                  </p>
                  {/* <div className="iframe-video">
                      { !this.state.isPlaying ?
                        (<img src="/coherence-map/images/icon/play-icon.png" className="play-btn" onClick={ this._playerPlay } />)
                        : (<img src="/coherence-map/images/icon/pause-icon.png" className="play-btn" onClick={ this._playerPlay } />)
                      }
                      <div className="overlay"></div>
                      <div id='iframe-video'>
                      </div>
                  </div> */}
                  
                  <div className="download-section">
                    <div className="iframe-video">
                      <div id='iframe-video'></div>
                    </div>

                    <h3>What is Mathematical Modeling?</h3>
                    <p>In this video, founding partner of Student Achievement Partners Jason Zimba, defines mathematical modeling, outlines types of modeling tasks, and explains what the standards imply for mathematical modeling in elementary, middle, and high school.</p>

                    <ul>
                      <li>
                        <p className="list-name">FILE TYPE</p>
                        <p className="list-value">MP4</p>
                      </li>
                      <li>
                        <p className="list-name">DOWNLOADS</p>
                        <p className="list-value">{this.state.videoDownloadCount >= 5000 ? this.formatNumber(this.state.videoDownloadCount) : '> 5,000' }</p>
                      </li>
                      {/* <li>
                        <p className="list-name">PAGES</p>
                        <p className="list-value">13</p>
                      </li> */}
                      <li>
                        <p className="list-name">FILE SIZE</p>
                        <p className="list-value">40 MB</p>
                      </li>
                    </ul>
                    <div className="node">
                      <a className="button"
                        onClick={() => this.downloadVideo()}
                        href={this.videoURLDownload}
                        // href="https://achievethecore.org/content/upload/What-is-Modeling_Coherence-Map-presentation-2019-01-25-2.mp4" 
                        // target="_blank"
                        >Download <i className="icon-down"></i></a>
                    </div>
                  </div>

                  {/* <div className="download-section">

                    <h3>Modeling PowerPoint</h3>
                    <p>
                      Ut aenean vitae maecenas mi, lobortis sit. Integer non mattis nullam, dolor dui leo arcu vestiba ulum tellus, curae ligula platea arcu sem nec. Per lacus vitae ipsum, eu tristique justo lorem ipsa.
                    </p>

                    <ul>
                      <li>
                        <p className="list-name">FILE TYPE</p>
                        <p className="list-value">ppt</p>
                      </li>
                      <li>
                        <p className="list-name">DOWNLOADS</p>
                        <p className="list-value">3,979</p>
                      </li>
                      <li>
                        <p className="list-name">PAGES</p>
                        <p className="list-value">13</p>
                      </li>
                      <li>
                        <p className="list-name">FILE SIZE</p>
                        <p className="list-value">184 KB</p>
                      </li>
                    </ul>
                    <div className="node">
                      <a className="button" href="" target="_blank">Download <i className="icon-down"></i></a>
                    </div>
                  </div> */}


                </div>
              </div>
            </div>

            <div className="modeling-container modeling-tasks">
              <div className="rows">
                <div className="col-2 col-left">
                  <div className="list-images">
                    <img src="/coherence-map/images/modeling/paper-back-1.png" className="index-2"/>
                    <img src="/coherence-map/images/modeling/paper-back-2.png" className="index-3"/>
                    <img src="/coherence-map/images/modeling/paper-back-3.png" className="index-4"/>
                    <img src="/coherence-map/images/modeling/paper-front.png" className="index-1"/>
                  </div>
                </div>
                <div className="col-2 col-right">
                  <div className="">
                    <h3>Modeling Tasks</h3>
                    <p>
                      A curated selection of medium- and high-intensity modeling tasks for use in high school. The tasks include annotations, scoring rubrics, and, in some cases, student work samples.
                    </p>

                    <div className="node">
                      <button onClick={() => this.props.onSelectStep('tasks')}>View Modeling Tasks</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MoreAboutModeling;