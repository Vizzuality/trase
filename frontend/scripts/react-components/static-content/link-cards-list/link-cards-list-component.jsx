import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-components/shared/icon';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import './link-cards-list.scss';

const Card = ({ data }) => {
  const { title, href } = data;
  return (
    <div className="c-link-card">
      <Text size="xl" weight="bold" variant="sans" restyled>
        {title}
      </Text>
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        <Heading variant="mono" color="pink" weight="bold" restyled>
          VIEW PDF
        </Heading>
        <div className="arrow-container">
          <Icon icon="icon-arrow" />
        </div>
      </a>
    </div>
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
    <div classNames="c-link-cards-list">
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
