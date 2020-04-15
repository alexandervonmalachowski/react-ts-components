import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import styles from './_slider.scss';
import classnames from 'classnames';
import Arrow from '../Icons/Arrow';
import VerticalSlider from '../VerticalSlider';

export interface ISliderSetting {
  breakPoint: number;
  itemsToShow: number;
  height?: number;
  slideBy?: number;
  gutter?: number;
}
interface ISliderProps {
  itemsToShow: number;
  height: number;
  slideBy: number;
  gutter: number;
  showArrows: boolean;
  showDots: boolean;
  className?: string;
  settings?: ISliderSetting[];
  onRenderDots?: (
    childCount: number,
    currIndex: number,
    onDotClick: (index: number) => void
  ) => JSX.Element;
  onRenderMinis?: (
    childCount: number,
    currIndex: number,
    onDotClick: (index: number) => void
  ) => JSX.Element;
}

const Slider: React.FC<ISliderProps> = (props) => {
  const slider = useRef(null);
  const slideElement = useRef(null);
  const [state, _setState] = useState({
    childWidth: 0,
    childCount: 0,
    sliderWidth: 0,
    translate: 0,
    translateMax: 0,
    animate: true,
    itemsToShow: 0,
    childIndex: 0,
    gutter: 0,
    slideBy: 0,
    height: 0,
    xDown: 0,
    moveX: 0,
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
    if (slideElement.current) {
      slideElement.current.addEventListener(
        'mousedown',
        handleMousedown,
        false
      );
      slideElement.current.addEventListener(
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
  }, [props.children, slider.current]);

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
    const gutterWidthsTotal: number = (childCount - 1) * childMargin;

    const childWidth: number =
      slider.current && slider.current.clientWidth > 0
        ? (slider.current.clientWidth - gutterWidthsVisible) / itemsToShow
        : 0;

    const sliderWidth: number = childWidth * childCount + gutterWidthsTotal;

    const translateMax: number =
      slider.current && slider.current.clientWidth < sliderWidth
        ? slider.current.clientWidth - sliderWidth
        : 0;

    setState({
      ...state,
      childWidth,
      translateMax,
      sliderWidth,
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
    const xDown = evt.pageX;
    const moveX = 0;

    slideElement.current.addEventListener('mousemove', handleMouseMove, false);
    slideElement.current.addEventListener('mouseup', handleMouseUp, false);
    slideElement.current.addEventListener('mouseleave', handleMouseUp, false);
    setState({ ...stateRef.current, xDown, moveX });
  };

  const handleMouseMove = (evt: MouseEvent) => {
    const moveX = evt.pageX - stateRef.current.xDown;
    handleMoveSlider(moveX);
  };

  const handleMoveSlider = (moveX: number) => {
    const {
      gutter,
      slideBy,
      translate,
      translateMax,
      childWidth,
    } = stateRef.current;
    if (!stateRef.current.xDown) {
      return;
    }

    if (moveX === 0) {
      return;
    }

    const moveDiff = moveX - stateRef.current.moveX;
    const gutters: number = gutter * 2;
    const newTranslate: number =
      moveDiff > 0
        ? translate + moveDiff < 0
          ? translate + moveDiff
          : 0
        : translate + moveDiff > translateMax
        ? translate + moveDiff
        : translateMax;
    const childTotalWidth: number = slideBy * (childWidth + gutters);
    const childIndex: number = Math.round(newTranslate / -childTotalWidth);

    setState({
      ...stateRef.current,
      translate: newTranslate,
      animate: false,
      moveX,
      childIndex,
    });
  };

  const handleMouseUp = (evt: MouseEvent) => {
    slideElement.current.removeEventListener(
      'mousemove',
      handleMouseMove,
      false
    );
    slideElement.current.removeEventListener('mouseup', handleMouseUp, false);
    slideElement.current.addEventListener('mouseleave', handleMouseUp, false);
    const { gutter, slideBy } = props;
    const { childWidth, childIndex } = stateRef.current;
    const childTotalWidth = (childWidth + gutter * 2) * slideBy;

    setState({
      ...stateRef.current,
      xDown: 0,
      translate: -(childIndex * childTotalWidth),
      animate: true,
    });
  };

  const handleTouchEnd = (evt: TouchEvent) => {
    slideElement.current.removeEventListener(
      'touchmove',
      handleTouchMove,
      false
    );
    slideElement.current.removeEventListener('touchend', handleTouchEnd, false);
    const { gutter, slideBy } = props;

    const { childWidth, childIndex } = stateRef.current;
    const childTotalWidth = (childWidth + gutter * 2) * slideBy;

    setState({
      ...stateRef.current,
      xDown: 0,
      translate: -(childIndex * childTotalWidth),
      animate: true,
    });
  };

  const handleTouchStart = (evt: TouchEvent) => {
    if (slider && !slider.current.contains(evt.target as Node)) {
      handleTouchEnd(evt);
      return;
    }
    const firstTouch = getTouches(evt)[0];
    const xDown = firstTouch.clientX;
    const moveX = 0;
    slideElement.current.addEventListener('touchmove', handleTouchMove, false);
    slideElement.current.addEventListener('touchend', handleTouchEnd, false);
    setState({ ...stateRef.current, xDown, moveX });
  };

  const handleTouchMove = (evt: TouchEvent) => {
    let moveX = evt.touches[0].clientX - stateRef.current.xDown;
    handleMoveSlider(moveX);
  };

  const onClick = (evt: MouseEvent, direction: string) => {
    evt.preventDefault();
    const {
      gutter,
      slideBy,
      translate,
      translateMax,
      childWidth,
      childIndex,
    } = state;
    const gutters = gutter * 2;

    if (direction === 'left') {
      if (translate < 0) {
        setState({
          ...state,
          translate:
            translate + slideBy * (childWidth + gutters) < 0
              ? translate + slideBy * (childWidth + gutters)
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
            translate - slideBy * (childWidth + gutters) > translateMax
              ? translate - slideBy * (childWidth + gutters)
              : translateMax,
          animate: true,
          childIndex: childIndex + 1,
        });
      }
    }
  };

  const onDotClick = (i: number) => {
    const { childWidth, gutter } = state;
    setState({
      ...state,
      translate: i === 0 ? 0 : -(i * childWidth + gutter * 2),
      childIndex: i,
      animate: true,
    });
  };

  const onDotsRender = (): JSX.Element => {
    const { childCount, childIndex } = state;
    const { onRenderDots, height } = props;

    if (onRenderDots) {
      return onRenderDots(childCount, childIndex, onDotClick);
    } else {
      return (
        <div className={styles.dots} style={{ top: `${height - 50}` }}>
          {_.times(childCount).map((i) => {
            return (
              <button
                className={classnames(styles.dot, {
                  [styles.active]: i === childIndex,
                })}
                key={i}
                onClick={() => onDotClick(i)}
              />
            );
          })}
        </div>
      );
    }
  };

  const onMinisRender = (): JSX.Element => {
    const { childCount, childIndex } = state;
    const { onRenderMinis, height, children } = props;

    if (onRenderMinis) {
      return onRenderMinis(childCount, childIndex, onDotClick);
    } else {
      return (
        <VerticalSlider
          itemsToShow={3}
          height={height}
          slideBy={1}
          gutter={5}
          showArrows={false}
          onSlideClick={onDotClick}
          selectedIndex={childIndex}
        >
          {children}
        </VerticalSlider>
      );
    }
  };

  const {
    translate,
    childWidth,
    gutter,
    animate,
    childCount,
    childIndex,
    itemsToShow,
    height,
  } = state;

  return (
    <>
      <div
        className={classnames(
          styles.slider,
          {
            [styles['show-arrows']]: props.showArrows,
            [styles['show-minis']]: !props.showArrows && itemsToShow === 1,
            [styles.active]: childWidth > 0,
          },
          props.className ? props.className : ''
        )}
        style={{
          height: `${height}px`,
        }}
      >
        {itemsToShow === 1 && !props.showArrows && onMinisRender()}
        {props.showArrows && childIndex > 0 && (
          <div
            className={classnames(styles.control, styles.prev)}
            onClick={(ev: any) => onClick(ev, 'left')}
          >
            <Arrow color={'#111111'} />
          </div>
        )}

        <div
          className={classnames(styles.inner, {
            [styles['show-arrows']]: props.showArrows,
          })}
          ref={slider}
        >
          <div
            ref={slideElement}
            className={classnames(styles.bar, { [styles.animate]: animate })}
            style={{
              transform: `translateX(${translate}px)`,
            }}
          >
            {React.Children.map(
              props.children,
              (child: React.ReactChild, i: number) => {
                return (
                  <div
                    key={`slideItem_${i}`}
                    className={styles.item}
                    style={{
                      width: childWidth > 0 ? childWidth : '100%',
                      marginLeft: i === 0 ? 0 : gutter,
                      marginRight:
                        i === React.Children.count(props.children) - 1
                          ? 0
                          : gutter,
                    }}
                  >
                    {child}
                  </div>
                );
              }
            )}
          </div>
          {props.showDots && onDotsRender()}
        </div>
        {props.showArrows &&
          childCount > 1 &&
          childCount > itemsToShow &&
          childCount > childIndex + itemsToShow && (
            <div
              className={classnames(styles.control, styles.next)}
              onClick={(ev: any) => onClick(ev, 'right')}
            >
              <Arrow color={'#111111'} />
            </div>
          )}
      </div>
    </>
  );
};

export default Slider;
