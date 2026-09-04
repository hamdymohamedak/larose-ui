export interface PopUpOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PopUpCustomOption {
  value: string;
  label: string;
  onSelect?: () => void;
}
