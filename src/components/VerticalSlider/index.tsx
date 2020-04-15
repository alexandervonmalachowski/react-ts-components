import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import Arrow from '../Icons/Arrow';
import { ISliderSetting } from '../Slider';
import styles from './_vertical_slider.scss';

interface IVerticalSliderProps {
  itemsToShow: number;
  height: number;
  slideBy: number;
  gutter: number;
  selectedIndex?: number;
  onSlideClick?: (selectedIndex: number) => void;
  showArrows: boolean;
  className?: string;
  settings?: ISliderSetting[];
}

const VerticalSlider: React.FC<IVerticalSliderProps> = (props) => {
  const verticalSlider = useRef(null);
  const verticalSlideElement = useRef(null);
  const [state, _setState] = useState({
    childHeight: 0,
    childCount: 0,
    sliderHeight: 0,
    translate: 0,
    translateMax: 0,
    animate: true,
    itemsToShow: 0,
    childIndex: 0,
    gutter: 0,
    slideBy: 0,
    height: 0,
    yDown: 0,
    moveY: 0,
  });

  const stateRef = useRef(state);

  const setState = (data) => {
    stateRef.current = data;
    _setState(data);
  };

  useEffect(() => {
    window.addEventListener('dragstart', handleDrag, false);
    window.addEventListener('drop', handleDrag, false);
    window.addEventListener('resize', calculateSlider, false);
    if (verticalSlideElement.current) {
      verticalSlideElement.current.addEventListener(
        'mousedown',
        handleMousedown,
        false
      );
      verticalSlideElement.current.addEventListener(
        'touchstart',
        handleTouchStart,
        false
      );

      calculateSlider();

      return () => {
        window.removeEventListener('dragstart', handleDrag, false);
        window.removeEventListener('drop', handleDrag, false);
        window.removeEventListener('resize', calculateSlider, false);
      };
    }
  }, []);

  useEffect(() => {
    calculateSlider();
  }, [props.children, verticalSlider.current]);

  const calculateSlider = () => {
    const { settings } = props;
    let setting: ISliderSetting = null;

    if (
      settings &&
      settings.length > 0 &&
      settings.filter((s) => s.breakPoint < window.innerWidth).length > 0
    ) {
      const breakPoints = settings
        .filter((s) => s.breakPoint <= window.innerWidth)
        .map((b) => b.breakPoint);
      const breakpoint = Math.max(...breakPoints);
      if (breakpoint) {
        setting = settings.filter((b) => b.breakPoint === breakpoint)[0];
      }
    }

    const itemsToShow = setting ? setting.itemsToShow : props.itemsToShow;
    let gutter = setting && setting.gutter ? setting.gutter : props.gutter;
    let height = setting && setting.height ? setting.height : props.height;
    if (itemsToShow === 1) {
      gutter = 0;
    }

    let slideBy = setting && setting.slideBy ? setting.slideBy : props.slideBy;

    if (itemsToShow === 1) {
      slideBy = 1;
    }

    const childMargin: number = gutter * 2;
    const gutterWidthsVisible: number = (itemsToShow - 1) * childMargin;
    const childCount: number = React.Children.count(props.children);
    const gutterHeightTotal: number = (childCount - 1) * childMargin;

    const childHeight: number =
      verticalSlider.current && verticalSlider.current.clientWidth > 0
        ? (verticalSlider.current.clientHeight - gutterWidthsVisible) /
          itemsToShow
        : 0;

    const sliderHeight: number = childHeight * childCount + gutterHeightTotal;

    const translateMax: number =
      verticalSlider.current &&
      verticalSlider.current.clientHeight < sliderHeight
        ? verticalSlider.current.clientHeight - sliderHeight
        : 0;

    setState({
      ...state,
      childHeight,
      translateMax,
      sliderHeight,
      childCount,
      translate: 0,
      itemsToShow,
      childIndex: 0,
      slideBy,
      height,
      gutter,
    });
  };

  const getTouches = (evt: TouchEvent) => {
    return evt.touches;
  };

  const handleDrag = (evt: DragEvent) => {
    evt.preventDefault();
    return false;
  };

  const handleMousedown = (evt: MouseEvent) => {
    evt.preventDefault();
    const yDown = evt.pageY;
    const moveY = 0;

    verticalSlideElement.current.addEventListener(
      'mousemove',
      handleMouseMove,
      false
    );
    verticalSlideElement.current.addEventListener(
      'mouseup',
      handleMouseUp,
      false
    );
    verticalSlideElement.current.addEventListener(
      'mouseleave',
      handleMouseUp,
      false
    );
    setState({ ...stateRef.current, yDown, moveY });
  };

  const handleMouseMove = (evt: MouseEvent) => {
    const moveY = evt.pageY - stateRef.current.yDown;
    handleMoveSlider(moveY);
  };

  const handleMoveSlider = (moveY: number) => {
    const {
      translate,
      translateMax,
      childHeight,
      gutter,
      slideBy,
    } = stateRef.current;
    if (!stateRef.current.yDown) {
      return;
    }

    if (moveY === 0) {
      return;
    }

    const moveDiff = moveY - stateRef.current.moveY;
    const gutters: number = gutter * 2;
    const newTranslate: number =
      moveDiff > 0
        ? translate + moveDiff < 0
          ? translate + moveDiff
          : 0
        : translate + moveDiff > translateMax
        ? translate + moveDiff
        : translateMax;
    const childTotalHeight: number = slideBy * (childHeight + gutters);
    const childIndex: number = Math.round(newTranslate / -childTotalHeight);

    setState({
      ...stateRef.current,
      translate: newTranslate,
      animate: false,
      moveY,
      childIndex,
    });
  };

  const handleMouseUp = (evt: MouseEvent) => {
    verticalSlideElement.current.removeEventListener(
      'mousemove',
      handleMouseMove,
      false
    );
    verticalSlideElement.current.removeEventListener(
      'mouseup',
      handleMouseUp,
      false
    );
    verticalSlideElement.current.addEventListener(
      'mouseleave',
      handleMouseUp,
      false
    );
    const { gutter, slideBy } = props;
    const { childHeight, childIndex } = stateRef.current;
    const childTotalHeight = (childHeight + gutter * 2) * slideBy;

    setState({
      ...stateRef.current,
      yDown: 0,
      translate: -(childIndex * childTotalHeight),
      animate: true,
    });
  };

  const handleTouchEnd = (evt: TouchEvent) => {
    verticalSlideElement.current.removeEventListener(
      'touchmove',
      handleTouchMove,
      false
    );
    verticalSlideElement.current.removeEventListener(
      'touchend',
      handleTouchEnd,
      false
    );

    const { childHeight, childIndex, gutter, slideBy } = stateRef.current;
    const childTotalHeight = (childHeight + gutter * 2) * slideBy;

    setState({
      ...stateRef.current,
      yDown: 0,
      translate: -(childIndex * childTotalHeight),
      animate: true,
    });
  };

  const handleTouchStart = (evt: TouchEvent) => {
    if (
      verticalSlider &&
      !verticalSlider.current.contains(evt.target as Node)
    ) {
      handleTouchEnd(evt);
      return;
    }
    const firstTouch = getTouches(evt)[0];
    const yDown = firstTouch.clientX;
    const moveY = 0;
    verticalSlideElement.current.addEventListener(
      'touchmove',
      handleTouchMove,
      false
    );
    verticalSlideElement.current.addEventListener(
      'touchend',
      handleTouchEnd,
      false
    );
    setState({ ...stateRef.current, yDown, moveY });
  };

  const handleTouchMove = (evt: TouchEvent) => {
    let moveY = evt.touches[0].clientX - stateRef.current.yDown;
    handleMoveSlider(moveY);
  };

  const onClick = (
    evt: React.MouseEvent<HTMLDivElement>,
    direction: string
  ) => {
    evt.preventDefault();
    const {
      gutter,
      slideBy,
      translate,
      translateMax,
      childHeight,
      childIndex,
    } = state;
    const gutters = gutter * 2;

    if (direction === 'left') {
      if (translate < 0) {
        setState({
          ...state,
          translate:
            translate + slideBy * (childHeight + gutters) < 0
              ? translate + slideBy * (childHeight + gutters)
              : 0,
          animate: true,
          childIndex: childIndex - 1,
        });
      }
    }
    if (direction === 'right') {
      if (translate > translateMax) {
        setState({
          ...state,
          translate:
            translate - slideBy * (childHeight + gutters) > translateMax
              ? translate - slideBy * (childHeight + gutters)
              : translateMax,
          animate: true,
          childIndex: childIndex + 1,
        });
      }
    }
  };

  const {
    translate,
    childHeight,
    gutter,
    animate,
    childCount,
    childIndex,
    itemsToShow,
    height,
  } = state;

  return (
    <div
      className={classnames(
        styles['vertical-slider'],
        {
          [styles['show-arrows']]: props.showArrows,
          [styles.active]: true,
        },
        props.className ? props.className : ''
      )}
      style={{
        height: `${height}px`,
      }}
    >
      {props.showArrows && childIndex > 0 && (
        <div
          className={classnames(styles.control, styles.prev)}
          onClick={(ev) => onClick(ev, 'left')}
        >
          <Arrow color={'#111111'} />
        </div>
      )}

      <div
        className={classnames(styles.inner, {
          [styles['show-arrows']]: props.showArrows,
        })}
        ref={verticalSlider}
      >
        <div
          ref={verticalSlideElement}
          className={classnames(styles.bar, { [styles.animate]: animate })}
          style={{
            transform: `translateY(${translate}px)`,
            width: verticalSlider.current
              ? `${verticalSlider.current.clientWidth}px`
              : '100%',
          }}
        >
          {React.Children.map(props.children, (child, i) => {
            return (
              <div
                onClick={() =>
                  props.onSlideClick ? props.onSlideClick(i) : null
                }
                key={`v_slideItem_${i}`}
                className={classnames(styles.item, {
                  [styles.selected]:
                    props.selectedIndex && props.selectedIndex === i,
                })}
                style={{
                  height: childHeight > 0 ? childHeight : '100%',
                  marginTop: i === 0 ? 0 : gutter,
                  marginBottom:
                    i === React.Children.count(props.children) - 1 ? 0 : gutter,
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
      {props.showArrows &&
        childCount > 1 &&
        childCount > itemsToShow &&
        childCount > childIndex + itemsToShow && (
          <div
            className={classnames(styles.control, styles.next)}
            onClick={(ev) => onClick(ev, 'right')}
          >
            <Arrow color={'#111111'} />
          </div>
        )}
    </div>
  );
};

export default VerticalSlider;
