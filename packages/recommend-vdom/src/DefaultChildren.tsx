/** @jsx createElement */

import { ChildrenProps, Renderer } from './types';
import { cx } from './utils';

export function createDefaultChildrenComponent({ createElement }: Renderer) {
  return function DefaultChildren<TObject>(props: ChildrenProps<TObject>) {
    if (props.recommendations.length === 0 && props.status === 'idle') {
      return <props.Fallback />;
    }

    return (
      <section className={cx('auc-Recommend', props.classNames.root)}>
        <props.Header
          classNames={props.classNames}
          recommendations={props.recommendations}
          translations={props.translations}
        />

        <props.View />
      </section>
    );
  };
}
