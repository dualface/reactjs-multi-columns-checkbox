import * as React from 'react';
import { OnOptionChange, Option } from './Types';

type Props = {
  option: Option;
  checked?: boolean;
  onChange: OnOptionChange;
};

const defaultProps = {
  checked: false,
};

function CheckBoxOption(props: Props) {
  const { option, checked, onChange } = props;

  console.log(`Render CheckBoxOption ${option.label}`);

  return (
    <div key={option.value}>
      <label className='label'>
        <input
          type='checkbox'
          checked={checked}
          value={option.value}
          onChange={(event) => {
            onChange(option, event.target.checked);
          }}
        />
        {option.label} ({option.value})
      </label>
    </div>
  );
}

CheckBoxOption.defaultProps = defaultProps;

function areOptionEqual(prevProps: Props, nextProps: Props): boolean {
  return (
    nextProps.option.label === prevProps.option.label &&
    nextProps.option.value === prevProps.option.value &&
    nextProps.checked === prevProps.checked
  );
}

export const MemoizedCheckBoxOption = React.memo(
  CheckBoxOption,
  areOptionEqual,
);
