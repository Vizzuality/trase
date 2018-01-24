import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import Hero from 'react-components/shared/hero.component';
import NavSidebar from './nav-sidebar.component';

class StaticContent extends React.PureComponent {
  render() {
    const { links = [], content = '', children, notFound } = this.props;
    const MarkdownContainer = p => (<div className="markdown-content">{p.children}</div>);
    return (
      <div className="c-static-content">
        <Hero className="-read-only" />
        {!notFound &&
          <React.Fragment>
            <NavSidebar links={links} />
            <section className="container">
              <div className="row">
                <div className="column small-12 medium-6 medium-offset-3">
                  {content &&
                  remark()
                    .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer } })
                    .processSync(content).contents
                  }
                  {children}
                </div>
              </div>
            </section>
          </React.Fragment>
        }
        {notFound &&
          <section className="not-found">
            <div className="row column">
              <p className="not-found-text">
                Oops! We can&#39;t seem to find the page you are looking for.
                <span className="emoji" role="img" aria-label="page not found"> 🙈</span>
              </p>
            </div>
          </section>
        }
      </div>
    );
  }
}

StaticContent.propTypes = {
  links: PropTypes.array,
  content: PropTypes.string,
  children: PropTypes.node,
  notFound: PropTypes.bool
};

export default StaticContent;
