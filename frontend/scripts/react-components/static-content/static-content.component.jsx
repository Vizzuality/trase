import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import Hero from 'react-components/shared/hero.component';
import NavSidebar from './nav-sidebar.component';
import NotFound from './not-found.component';

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
        {notFound && <NotFound />}
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
