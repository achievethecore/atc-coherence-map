var shallowEqual = require('react/lib/shallowEqual');
var Component = require('react').Component;

export class Pin extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
<svg viewBox="0 0 15.833375 23.955875" height="23.955875" width="15.833375" version="1.1" className="svg-icon">
  <g transform="matrix(1.25,0,0,-1.25,0,23.955875)">
    <g transform="translate(6.3333,10.9279)">
      <path style={{fill:'#25a56a',/*fill-opacity:1;fill-rule:nonzero;stroke:none*/ }}
      d="m 0,0 c -1.221,0 -2.211,0.99 -2.211,2.211 0,1.221 0.99,2.211 2.211,2.211 1.221,0 2.211,-0.99 2.211,-2.211 C 2.211,0.99 1.221,0 0,0 M 0,8.237 C -4.666,8.237 -7.457,4.064 -5.899,0.028 -4.474,-3.666 -1.361,-4.901 0,-10.928 1.167,-4.901 4.474,-3.666 5.899,0.028 7.457,4.064 4.666,8.237 0,8.237" />
    </g>
  </g>
</svg>);
  }
}

export class Boxes extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
        <svg version="1.1" viewBox="0 0 468.92871 293.92855" height="17px" width="27px" className="svg-icon">
          <g transform="translate(-93.214168,-39.505075)">
            <path d="m 100.71429,134.14792 0,104.64285 157.5,0 0,-51.78571 69.64285,0 0,86.42857 69.64286,0 0,52.5 157.14286,0 0,-103.57143 -156.78572,0 -0.33482,51.07143 -69.30803,0 0,-172.85714 69.64285,0 0,50.35714 156.42858,0 0,-103.92857 -156.42858,0 0,53.21429 -69.64285,0 -0.35714,86.74107 -69.62055,-0.0223 -0.37946,-53.50447 -157.14286,0.0446 z"
            style={{fill:'none',stroke:'#ffffff',strokeWidth:15,/*stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1*/}} />
          </g>
        </svg>);
  }
}
export class ZoomOut extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
        <svg className="svg-icon" version="1.1" x="0px" y="0px"
         viewBox="0 0 227.406 227.406" style={{fill:'#FFF'}}>
      <g>
        <path d="M217.575,214.708l-65.188-67.793c16.139-15.55,26.209-37.356,26.209-61.485
          C178.596,38.323,140.272,0,93.167,0C46.06,0,7.737,38.323,7.737,85.43c0,47.106,38.323,85.43,85.43,85.43
          c17.574,0,33.922-5.339,47.518-14.473l66.078,68.718c1.473,1.531,3.439,2.302,5.407,2.302c1.87,0,3.743-0.695,5.197-2.094
          C220.353,222.441,220.446,217.693,217.575,214.708z M22.737,85.43c0-38.835,31.595-70.43,70.43-70.43
          c38.835,0,70.429,31.595,70.429,70.43s-31.594,70.43-70.429,70.43C54.332,155.859,22.737,124.265,22.737,85.43z"/>
        <path d="M131.414,77.93H54.919c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h76.495
          c4.143,0,7.5-3.357,7.5-7.5S135.557,77.93,131.414,77.93z"/>
            </g>
        </svg>);
  }
}

export class Share extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
        <svg className="svg-icon" version="1.1" x="0px" y="0px"
         viewBox="0 0 473.932 473.932" style={{fill:'currentColor'}}>
      <g>
      <path d="M385.513,301.214c-27.438,0-51.64,13.072-67.452,33.09l-146.66-75.002
        c1.92-7.161,3.3-14.56,3.3-22.347c0-8.477-1.639-16.458-3.926-24.224l146.013-74.656c15.725,20.924,40.553,34.6,68.746,34.6
        c47.758,0,86.391-38.633,86.391-86.348C471.926,38.655,433.292,0,385.535,0c-47.65,0-86.326,38.655-86.326,86.326
        c0,7.809,1.381,15.229,3.322,22.412L155.892,183.74c-15.833-20.039-40.079-33.154-67.56-33.154
        c-47.715,0-86.326,38.676-86.326,86.369s38.612,86.348,86.326,86.348c28.236,0,53.043-13.719,68.832-34.664l145.948,74.656
        c-2.287,7.744-3.947,15.79-3.947,24.289c0,47.693,38.676,86.348,86.326,86.348c47.758,0,86.391-38.655,86.391-86.348
        C471.904,339.848,433.271,301.214,385.513,301.214z"/>
            </g>
        </svg>);
  }
}


export class ArrowDL extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
        <svg className="svg-icon" version="1.1" width="16" height="18"  x="0px" y="0px"
         viewBox="0 0 50 55.057653" style={{fill:'none',stroke:'currentColor',strokeWidth:4}}>
         <g
            transform="translate(-260,-252.80453)">
           <path
              d="M 309.4856,277.37486 284.91527,301.9452 260.34494,277.37486"/>
           <path
              d="m 284.91527,301.9452 0,-49.14067" />
           <path
              d="m 260,307.36218 50,0" />
         </g>
        </svg>);
  }
}

export class ArrowExt extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  render() {
      return (
        <svg className="svg-icon" version="1.1" width="12" height="14" x="0px" y="0px"
         viewBox="0 0 50 50" style={{fill:'none',stroke:'currentColor',strokeWidth:4}}>
         <g
            transform="translate(-259.64645,-252.71575)">
            <path
               d="m 260,252.3622 50,0 0,50"/>
            <path
               d="m 310,252.3622 -50,50"/>

         </g>
        </svg>);
  }
}
