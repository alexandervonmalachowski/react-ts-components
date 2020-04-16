import React from 'react';
import styles from './_storybook.scss';
import Slider from '.';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withLiveEditScope } from 'storybook-addon-react-live-edit';

export default {
  title: 'Slider',
};
const settings = [
  {
    breakPoint: 1900,
    itemsToShow: 7,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 1600,
    itemsToShow: 6,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 1200,
    itemsToShow: 5,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 992,
    itemsToShow: 4,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 800,
    itemsToShow: 4,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 600,
    itemsToShow: 3,
    slideBy: 1,
    gutter: 5,
  },
  {
    breakPoint: 300,
    itemsToShow: 1,
    slideBy: 1,
    gutter: 5,
  },
];
storiesOf('Slider', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addDecorator(withLiveEditScope({ React, Slider }))
  .addLiveSource(
    'Playground',
    `return  <Slider
    key={'first'}   
    height={250}
    itemsToShow={1}
    slideBy={1}
    gutter={5}
    showDots={false}
    showArrows={true}
  >
    {_.times(10).map((i) => {
      return (
        <div className={'slide-item'} key={i}>
          <span>{i}</span>
        </div>
      );
    })}
  </Slider>`
  )
  .add('SliderWithArrows', () => (
    <Slider
      key={'first'}
      settings={settings}
      height={250}
      itemsToShow={1}
      slideBy={1}
      gutter={5}
      showDots={false}
      showArrows={true}
    >
      {_.times(10).map((i) => {
        return (
          <div className={styles['slide-item']} key={i}>
            <span>{i}</span>
          </div>
        );
      })}
    </Slider>
  ))
  .add('SliderWithMinis', () => (
    <div className={styles.small}>
      <Slider
        key={'second'}
        height={250}
        itemsToShow={1}
        slideBy={1}
        gutter={0}
        showDots={true}
        showArrows={false}
      >
        {_.times(10).map((i) => {
          return (
            <div className={styles['slide-item']} key={i}>
              <span>{i}</span>
            </div>
          );
        })}
      </Slider>
    </div>
  ));
