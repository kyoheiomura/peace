import { CharPickerDesignFrame } from "@/components/designs/CharPickerDesignFrame";

export default function CharPicker2x8Page2() {
  return (
    <CharPickerDesignFrame
      layout="2x8"
      page={2}
      totalPages={2}
      selected="INFP"
      scrollHalf
    />
  );
}
