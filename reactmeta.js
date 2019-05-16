var Component = require('react').Component;

export class ReactMeta extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    desc: React.PropTypes.string
  }

  componentWillMount() {
    this.setTitle();
  }
  componentDidUpdate() {
    this.setTitle();
  }
  setTitle() {
    if (!this.props.title) document.title = 'Coherence Map';
    else document.title = `${this.props.title} - Coherence Map`;
    const desc = document.querySelector('meta[name="description"]');
    if (!this.props.desc) desc.setAttribute('content', 'The Coherence Map shows the connections between Common Core State Standards for Mathematics.');
    else desc.setAttribute('content', this.props.desc.replace(/<.*?>/g, ''));
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    document.querySelector("link[rel='canonical']").setAttribute('href', 'https://achievethecore.org' + window.location.pathname);
  }
  render() { return null; }
}
