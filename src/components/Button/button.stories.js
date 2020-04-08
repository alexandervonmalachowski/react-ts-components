import React from 'react';
import Button from './';
import styles from './_storybook.scss';
import classnames from 'classnames';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  object,
  select,
} from '@storybook/addon-knobs';
const themes = ['primary', 'secondary'];
export default {
  title: 'Button',
  component: Button,
};

export const Themed = () => (
  <Button onClick={action('onClick')} type={select('type', themes, 'primary')}>
    Themed
  </Button>
);

export const OverrideClassName = () => (
  <Button
    className={classnames(styles['button-override'], styles.secondary)}
    type={'secondary'}
  >
    secondary
  </Button>
);

export const Playground = () => (
  <Button
    className={text('className', 'some-class')}
    type={select('type', themes, 'primary')}
  >
    {text('content', 'replace me!')}
  </Button>
);
