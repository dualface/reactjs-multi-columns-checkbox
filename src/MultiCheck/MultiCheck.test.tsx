/**
 * @jest-environment jsdom
 */
/* eslint-disable import/no-extraneous-dependencies */

import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';

import { options } from '../DemoOptionsData';
import { MultiCheck } from './MultiCheck';
import { OnOptionsChange, Option } from './Types';

/// helper functions

function isChecked(input: HTMLElement): boolean {
  const attrs = input.getAttributeNames();
  return attrs.indexOf('checked') !== -1;
}

function chooseOptionsRandom(): string[] {
  const selected: string[] = [];
  let n = Math.floor((Math.random() * options.length) / 2) + 1;
  while (n > 0) {
    const i = Math.floor(Math.random() * options.length);
    const v = options[i].value;
    if (selected.indexOf(v) === -1) {
      selected.push(v);
      n -= 1;
    }
  }
  return selected;
}

function getInputByValue(
  inputs: HTMLElement[],
  value: string,
): HTMLElement | null {
  let found: HTMLElement | null = null;
  inputs.forEach((input) => {
    if (found) {
      return;
    }
    if (input.getAttribute('value') === value) {
      found = input;
    }
  });
  return found;
}

function getOptionsChangeHandler(checks: string[]): OnOptionsChange {
  return (changes: [Option, boolean][]) => {
    changes.forEach(([option, checked]) => {
      const v = option.value;
      if (checked) {
        if (checks.indexOf(v) === -1) {
          checks.push(v);
        }
      } else {
        const i = checks.indexOf(option.value);
        if (i !== -1) {
          checks.splice(i, 1);
        }
      }
    });
  };
}

function clickOptions(inputs: HTMLElement[], values: string[]) {
  values.forEach((value) => {
    const input = getInputByValue(inputs, value);
    fireEvent.click(input!);
  });
}

/// tests

test('have a title', async () => {
  const titleText = '_TEST_TITLE_';
  render(<MultiCheck label={titleText} />);

  const titles = await screen.findAllByText(titleText);
  expect(titles).toHaveLength(1);
  const first = titles[0];
  expect(first.innerHTML).toEqual(titleText);
});

test('have a list of options, and all options should be matching', async () => {
  render(<MultiCheck options={options} />);

  const inputs = await screen.findAllByRole('checkbox');
  expect(inputs.length).toBeGreaterThan(0);

  // first checkbox is 'Select All'
  const first = inputs.shift();
  expect(first).toBeDefined();
  expect(first?.getAttribute('value')).toEqual('select-all');

  expect(inputs).toHaveLength(options.length);

  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    const input = inputs[i];

    expect(input.getAttribute('value')).toEqual(option.value);
    const parent = input.parentElement;
    expect(parent).toBeDefined();

    const label = `${option.label} (${option.value})`;
    expect(parent?.textContent).toEqual(label);
  }
});

test('make sure default selected options should have checked', async () => {
  const selected = chooseOptionsRandom();

  render(<MultiCheck options={options} values={selected} />);

  const inputs = await screen.findAllByRole('checkbox');
  inputs.forEach((input) => {
    const v = input.getAttribute('value');
    expect(typeof v).toEqual('string');
    const checked = isChecked(input);

    if (selected.indexOf(v!) !== -1) {
      expect(checked).toBeTruthy();
    } else {
      expect(checked).toBeFalsy();
    }
  });
});

test('select options by event', async () => {
  const checks: string[] = [];
  const handle = getOptionsChangeHandler(checks);

  const renderResult = render(
    <MultiCheck options={options} values={checks} onOptionsChange={handle} />,
  );
  const inputs = await screen.findAllByRole('checkbox');
  const selected = chooseOptionsRandom().sort();

  clickOptions(inputs, selected);
  expect(checks.sort()).toEqual(selected);

  // rerender
  renderResult.rerender(
    <MultiCheck options={options} values={checks} onOptionsChange={handle} />,
  );
  clickOptions(inputs, selected);
  expect(checks.sort()).toEqual([]);
});

test('make sure "Select All" working as expected', async () => {
  const checks: string[] = [];
  const handle = getOptionsChangeHandler(checks);

  const renderResult = render(
    <MultiCheck options={options} values={checks} onOptionsChange={handle} />,
  );
  const rerender = () => {
    renderResult.rerender(
      <MultiCheck options={options} values={checks} onOptionsChange={handle} />,
    );
  };

  const inputs = await screen.findAllByRole('checkbox');
  const selected = chooseOptionsRandom().sort();

  clickOptions(inputs, selected);
  expect(checks.sort()).toEqual(selected);
  rerender();

  // click 'Select All'
  fireEvent.click(inputs[0]);
  rerender();
  // all options should be checked
  expect(checks).toHaveLength(options.length);

  // click 'Select All'
  fireEvent.click(inputs[0]);
  rerender();
  // all options should be unchecked
  expect(checks).toHaveLength(0);
});
