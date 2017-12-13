import { h } from 'preact';
import cx from 'classnames';
import 'styles/components/tool/nodesTitles.scss';

export default function NodeTitle({ columns = [], recolorGroup, onClose }) {
  return (
    <div className={cx('c-node-title', `-recolorgroup-${recolorGroup}`)}>
      {
        columns.map(column => (
          <div className='column'>
            <div className='column-title'>{column.title}</div>
            <div className='column-content'>
              {column.content}
              <span className='unit'>{column.unit}</span>
            </div>
          </div>
        ))
      }
      <div className='column'>
        <div className='column-content' onClick={onClose}>
          <svg class='icon icon-close'>
            <use xlinkHref='#icon-close' />
          </svg>
        </div>
      </div>
    </div>
  );
}