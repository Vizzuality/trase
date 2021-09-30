import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import './link-cards-list.scss';

const Card = ({ data }) => {
  const { title, href } = data;
  return (
    <a className="c-link-card" href={href} target="_blank" rel="noopener noreferrer">
      <Text size="xl" weight="bold" variant="sans" lineHeight="md" className="title" restyled>
        {title}
      </Text>
      <div className="view-pdf-container">
        <Text
          variant="mono"
          color="pink"
          weight="bold"
          className="link-card-pdf-text"
          as="span"
          restyled
        >
          VIEW PDF
        </Text>
        <div className="round-button">
          <div className="icon-pdf-arrow" />
        </div>
      </div>
    </a>
  );
};

Card.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string
  })
};

function LinkCardsList({ data }) {
  const filteredListItems = data.filter(d => !!d.type);
  const listItems = filteredListItems
    .map(d =>
      d.props?.children
        ?.filter(link => !!link.type)
        .map(link => ({ href: link?.props?.href, title: link?.props?.children[0] }))
    )
    .flat();

  return (
    <div className="c-link-cards-list">
      {listItems.map(item => (
        <Card data={item} />
      ))}
    </div>
  );
}

LinkCardsList.propTypes = {
  data: PropTypes.node
};

export default LinkCardsList;
