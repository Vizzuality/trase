import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import Hero from 'react-components/shared/hero.component';
import NavSidebar from 'react-components/shared/nav-sidebar.component';

function StaticContent(props) {
  const { links = [], content = '', children } = props;
  const MarkdownContainer = p => (<div className="markdown-content">{p.children}</div>);
  return (
    <div className="c-static-content">
      <Hero className="-read-only" />
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
    </div>
  );
}

StaticContent.propTypes = {
  links: PropTypes.array,
  content: PropTypes.string,
  children: PropTypes.node
};

export default StaticContent;
