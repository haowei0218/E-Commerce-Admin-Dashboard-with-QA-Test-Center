import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "data-horizontal:w-full data-vertical:h-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-200"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full bg-black"
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          className="relative block size-4 shrink-0 rounded-full border border-gray-400 bg-white shadow-sm"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
