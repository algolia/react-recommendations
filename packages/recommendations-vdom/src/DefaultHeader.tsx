/** @jsx createElement */

import { ComponentProps, Renderer } from './types';
import { cx } from './utils';

export function createDefaultHeaderComponent({ createElement }: Renderer) {
  return function DefaultHeader<TObject>(props: ComponentProps<TObject>) {
    if (!props.translations.title) {
      return null;
    }

    return (
      <h3 className={cx('auc-Recommendations-title', props.classNames.title)}>
        {props.translations.title}
      </h3>
    );
  };
}
