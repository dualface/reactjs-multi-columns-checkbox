import * as React from 'react';
import { MemoizedCheckBoxOption } from './CheckBoxOption';
import './MultiCheck.css';
import { OnOptionsChange, Option } from './Types';

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. If columns > 1, the options should be placed from top to bottom in each column
 *
 * @param {string} label - the label text of this component
 * @param {Option[]} options - options
 * @param {string[]} values - default checked option values
 * @param {number} columns - default value is 1
 * @param {Function} onOptionsChange - when checked options are changed,
 *                                     they should be passed to outside
 */
interface Props {
  label?: string;
  options?: Option[];
  values?: string[];
  columns?: number;
  onOptionsChange?: OnOptionsChange | undefined;
}

const defaultProps = {
  label: '',
  options: [],
  values: [],
  columns: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOptionsChange: () => {},
};

function MultiCheck(props: Props) {
  const label = props.label ?? defaultProps.label;
  const options = props.options ?? defaultProps.options;
  const values = props.values ?? defaultProps.values;
  const columns = props.columns ?? defaultProps.columns;
  const onOptionsChange = props.onOptionsChange ?? defaultProps.onOptionsChange;

  const selectedAll = values?.length === options.length;
  const onSelectAllClicked = () => {
    const changes: [Option, boolean][] = [];
    options.forEach((it) => {
      changes.push([it, !selectedAll]);
    });
    onOptionsChange(changes);
  };

  // Calculate the number of options in each column
  const extraCount = 1; // first option is 'Select All'
  const count = options.length;
  let optionsPerColumn = Math.floor((count + extraCount) / columns);
  if (optionsPerColumn < 1) {
    optionsPerColumn = 1;
  }
  // make sure ((count + extraCount) / optionsPerColumn) <= columns
  while (Math.ceil((count + extraCount) / optionsPerColumn) > columns) {
    optionsPerColumn += 1;
  }

  const allColumns: JSX.Element[][] = [];
  let column: JSX.Element[] = [];
  // add 'Select All' to first column
  column.push(
    <label key='select-all' className='label select-all'>
      <input
        type='checkbox'
        value='select-all'
        checked={selectedAll}
        onChange={onSelectAllClicked}
      />
      Select All
    </label>,
  );
  allColumns.push(column);

  // render all options
  let countInGroup = extraCount;
  for (let i = 0; i < count; i += 1) {
    const option = options[i];
    const checked = values ? values.indexOf(option.value) !== -1 : false;
    column.push(
      <MemoizedCheckBoxOption
        key={option.value}
        option={option}
        checked={checked}
        onChange={(it: Option, checked: boolean) => {
          onOptionsChange([[it, checked]]);
        }}
      />,
    );

    countInGroup += 1;
    if (countInGroup === optionsPerColumn) {
      countInGroup = 0;
      if (i < count - 1) {
        // make new column
        column = [];
        allColumns.push(column);
      }
    }
  }

  const children: JSX.Element[] = [];
  allColumns.forEach((it, i) => {
    children.push(
      // eslint-disable-next-line react/no-array-index-key
      <div className='group' key={`group-${i}`}>
        {it}
      </div>,
    );
  });

  return (
    <div className='MultiCheck'>
      <div className='header'>
        <h2>{label}</h2>
      </div>
      <div className='contents'>{children}</div>
    </div>
  );
}

MultiCheck.defaultProps = defaultProps;

export { MultiCheck };
