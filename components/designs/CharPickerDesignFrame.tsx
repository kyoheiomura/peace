import { CharPickerDesign, type CharPickerDesignProps } from "./CharPickerDesign";

type Props = CharPickerDesignProps;

export function CharPickerDesignFrame(props: Props) {
  return (
    <div className="phone-mockup">
      <CharPickerDesign {...props} />
    </div>
  );
}
