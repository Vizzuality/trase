import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import Hero from 'react-components/shared/hero.component';
import NavSidebar from 'react-components/shared/nav-sidebar.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';

const defaultLinks = [
  {
    name: 'About Trase',
    page: 'about'
  },
  {
    name: 'Terms of Use',
    page: 'termsOfUse'
  },
  {
    name: 'Data and Methods',
    page: 'dataMethods'
  },
  {
    name: 'FAQ',
    page: 'faq'
  },
  {
    name: 'Team',
    page: {
      type: 'about',
      payload: { section: 'team' }
    }
  },
  {
    name: 'Partners',
    page: {
      type: 'about',
      payload: { section: 'partners' }
    }
  },
  {
    name: 'Funders',
    page: {
      type: 'about',
      payload: { section: 'funders' }
    }
  }
];

const defaultContent = `Trase is a powerful new sustainability platform that enables governments, companies,
investors and others to better understand and address the environmental and social impacts
linked to their supply chains.

            
Its pioneering approach draws on vast sets of production, trade and customs data, for the
first time laying bare the flows of globally-traded commodities from production landscapes
to consumer countries at scale. Along the way it identifies the ports of export and import,
and the producers, traders and transporters involved. These supply chain actors can then be
linked back to environmental and social risk factors on the ground, as well as information
on the social and governance factors necessary to improve conditions.

            
Trase focuses on the handful of commodities – including soy, beef, palm oil and timber –
that drive two thirds of deforestation globally. It comes as a direct response to the
ambitious commitments made by leaders across sectors to achieve deforestation-free supply
chains by 2020 - and the urgent need this creates for a breakthrough in assessing and
monitoring sustainability performance.

            
Over the next 5 years, Trase aims to map the trade and risks for over 70% of total
production in major forest risk commodities, catalyzing a transformation in supply chain
sustainability for the agricultural drivers of deforestation. Read our vision for Trase.
`;

function StaticContent(props) {
  const { links, content, children } = props;
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
      <NewsletterForm />
    </div>
  );
}

StaticContent.propTypes = {
  links: PropTypes.array,
  content: PropTypes.string,
  children: PropTypes.node
};

StaticContent.defaultProps = {
  links: defaultLinks,
  content: defaultContent
};

export default StaticContent;
