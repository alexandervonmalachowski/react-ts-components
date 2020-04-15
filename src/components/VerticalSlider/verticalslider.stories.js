import React from 'react';
import styles from './_storybook.scss';
import VerticalSlider from '.';
import { storiesOf, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

storiesOf('Vertical Slider', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .add('VerticalSlider', () => (
    <div className={styles.small}>
      <VerticalSlider
        itemsToShow={2}
        height={500}
        slideBy={1}
        gutter={5}
        showArrows={false}
      >
        {_.times(10).map((i) => {
          return (
            <div className={styles['slide-item']} key={i}>
              <span>{i}</span>
            </div>
          );
        })}
      </VerticalSlider>
    </div>
  ));
