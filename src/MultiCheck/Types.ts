export type Option = {
  label: string;
  value: string;
};

export type OnOptionsChange = (changes: [Option, boolean][]) => void;

export type OnOptionChange = (option: Option, checked: boolean) => void;
