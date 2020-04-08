# react-ts-components
Components libary using React Typescript Babel Sass with Storybook to view the componets

Commands
```
yarn run install
yarn run build
yarn run storybook

```

To test libary locally clone project next to your project and 

```
yarn add ../react-ts-comonents

```

```javascript
(_app.scss)
.title {
  color: red;
}
.small {
  height: 250px;
  margin: 20px auto;
  max-width: 500px;
  width: 100%;
}
.slide-item {
  background-color: red;
  color: #fff;
  display: block;
  font-size: 58px;
  height: 100%;
  width: 100%;
  span {
    left: calc(50% - 14.5px);
    position: absolute;
    top: calc(50% - 33.5px);
  }
}

(App.tsx)
import React from 'react';
import styles from './_app.scss';
import { Slider, ISliderSetting, Button } from 'react-ts-components';
import _ from 'lodash';

const App: React.FC = () => {
  const settings: ISliderSetting[] = [
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
  return (
    <div>
      <h1 className={styles.title}>Testar Sass</h1>
      <Button>Click me</Button>
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
    </div>
  );
};

export default App;


```
