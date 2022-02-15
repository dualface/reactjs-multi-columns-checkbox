import * as React from 'react';
import './App.css';
import { options } from './DemoOptionsData';
import { MultiCheck, Option } from './MultiCheck';

interface AppState {
  values: string[];
}

interface AppAction {
  type: 'changes';
  changes?: [Option, boolean][];
}

const initialState: AppState = { values: ['UAG', 'CSO'] };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'changes': {
      const updated = [...state.values];
      action.changes?.forEach(([it, checked]) => {
        const i = updated.indexOf(it.value);
        if (checked && i === -1) {
          updated.push(it.value);
        } else if (!checked && i !== -1) {
          updated.splice(i, 1);
        }
      });
      return { values: updated };
    }

    default:
      return initialState;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [columns, setColumns] = React.useState(2);

  return (
    <div className='App'>
      <h1>Multi Check Component</h1>
      <div className='row inputs'>
        <span>Number of columns:</span>
        <button
          type='button'
          onClick={() => {
            if (columns > 1) {
              setColumns(columns - 1);
            }
          }}
        >
          Reduce
        </button>
        <span>{columns}</span>
        <button
          type='button'
          onClick={() => {
            setColumns(columns + 1);
          }}
        >
          Increase
        </button>
      </div>
      <div className='row'>
        <MultiCheck
          label='Status'
          options={options}
          values={state.values}
          columns={columns}
          onOptionsChange={(changes) => {
            dispatch({ type: 'changes', changes });
          }}
        />
      </div>
      <div className='row'>
        <h2>Current selected values:</h2>
        <div>{state.values.join(',')}</div>
      </div>
    </div>
  );
}

export default App;
