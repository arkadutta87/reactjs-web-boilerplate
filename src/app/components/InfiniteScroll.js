import React from 'react';
import ReactDom from 'react-dom';

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }

    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

const DefaultLoader = (<div className="loader">Loading ...</div>);

const InfiniteScroll = React.createClass({

    propTypes: {
        hasMore: React.PropTypes.bool.isRequired,
        currentPage: React.PropTypes.number.isRequired,
        threshold: React.PropTypes.number,
        loadMore: React.PropTypes.func.isRequired,
        loader: React.PropTypes.element
    },

    getDefaultProps() {
        return {
            hasMore: false,
            loadMore() {
            },

            threshold: 1500
        };
    },

    componentDidMount() {
        this.attachScrollListener();
    },

    componentDidUpdate() {
        this.attachScrollListener();
    },

    componentWillUnmount() {
        this.detachScrollListener();
    },

    scrollListener() {
        if (!this.props.hasMore) {
            this.detachScrollListener();

            return;
        }

        const el = ReactDom.findDOMNode(this);
        const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this.detachScrollListener();

            // call loadMore after detachScrollListener to allow
            // for non-async loadMore functions
            this.props.loadMore(this.props.currentPage + 1);
        }
    },

    attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }

        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('resize', this.scrollListener);
    },

    detachScrollListener() {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    },

    render() {
        const props = this.props;

        return (<div className={this.props.className}>
            {props.children}
            {props.hasMore ? (props.loader || DefaultLoader) : null}
        </div>);
    }
});

export default InfiniteScroll;