var Component = require('react').Component;
var classNames = require('classnames');

export default class ModalLink extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (<div className={classNames('modal-wrapper', this.props.modalClass)}>
      <div className='modal-bg' style={{opacity: this.props.modalBG ? 1 : 0}} onClick={this.props.modalOnClose}></div>
      <div className='modal'>
        <h2>{this.props.modalTitle}</h2>
        {this.props.children}
        <div className="node">
          <a href={ this.props.link } target={this.props.target ? '_blank' : ''} className="button" onClick={this.props.modalOnClose}>{this.props.modalCTA||'Dismiss'} 
          {this.props.target  &&
            <i className="icon-down rotate"></i>
          }
          </a>
        </div>
        {this.props.modalClose ? <button className='close' onClick={this.props.modalOnClose}><i className="fa fa-times"></i></button> : null}</div>
    </div>);
  }
}
