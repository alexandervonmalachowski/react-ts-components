import React from 'react';
import styles from './_storybook.scss';
import VerticalSlider from '.';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withLiveEditScope } from 'storybook-addon-react-live-edit';

storiesOf('Vertical Slider', module)
  .addDecorator(withLiveEditScope({ React, VerticalSlider }))
  .addLiveSource(
    'Playground',
    `return <div className={'small'}>
      <VerticalSlider
        itemsToShow={2}
        height={500}
        slideBy={1}
        gutter={5}
        showArrows={false}
      >
        {_.times(10).map((i) => {
          return (
            <div className={'slide-item'} key={i}>
              <span>{i}</span>
            </div>
          );
        })}
      </VerticalSlider>
    </div>`
  )
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
