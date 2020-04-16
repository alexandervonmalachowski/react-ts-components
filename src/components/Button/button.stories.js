import React from 'react';
import Button from '.';
import styles from './_storybook.scss';
import classnames from 'classnames';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withLiveEditScope } from 'storybook-addon-react-live-edit';

const themes = ['primary', 'secondary'];

storiesOf('Button', module)
  .addDecorator(withLiveEditScope({ React, Button }))
  .addLiveSource(
    'Playground',
    `return   <Button
  className={'some-class'}
  type={'primary'}
>
 Themed
</Button>`
  )
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .add('Themed', () => (
    <Button
      className={text('className', 'some-class')}
      type={select('type', themes, 'primary')}
    >
      {text('content', 'Themed')}
    </Button>
  ));
