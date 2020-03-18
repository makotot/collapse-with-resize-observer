/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { useSpring, animated } from "react-spring";

const useActualHeightObserver = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [height, update] = React.useState(0);
  const [ro] = React.useState(
    () =>
      new ResizeObserver(([entry]) => {
        console.log(entry.contentRect.height);
        update(entry.contentRect.height);
      })
  );

  React.useEffect(() => {
    if (ref.current) {
      console.log(ro);
      ro.observe(ref.current);
    }
    return () => ro.disconnect();
  }, [ro]);

  return {
    ref,
    height
  };
};

const usePrevious = (value: any) => {
  const ref = React.useRef<any>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const useCollapse = ({ isOpen = false }: { isOpen?: boolean }) => {
  const { ref, height: actualHeight } = useActualHeightObserver();
  const previous = usePrevious(isOpen);
  const props = useSpring({
    from: {
      height: 0
    },
    to: {
      height: isOpen ? actualHeight : 0
    }
  });

  return {
    ref,
    style: {
      height: isOpen && previous === isOpen ? "auto" : (props as any).height
    }
  };
};

const Collpase: React.FC<{
  isOpen?: boolean;
}> = ({ isOpen, children }) => {
  const { ref, style } = useCollapse({ isOpen });
  return (
    <animated.div
      css={{
        overflow: "hidden"
      }}
      style={style}
    >
      <div
        css={{
          backgroundColor: "#53c",
          color: "#fff",
          padding: "1rem"
        }}
        ref={ref}
      >
        {children}
      </div>
    </animated.div>
  );
};

export default function App() {
  const [state, toggle] = React.useState(false);

  return (
    <div className="App">
      <button
        onClick={() => toggle(!state)}
        css={{
          padding: "0.5rem",
          appearance: "none",
          color: "#33c",
          border: "1px solid #33c",
          fontSize: "14px"
        }}
      >
        {state ? "close" : "open"}
      </button>
      <Collpase isOpen={state}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Leo vel fringilla
        est ullamcorper eget. Amet mauris commodo quis imperdiet massa. Purus in
        massa tempor nec feugiat nisl. Arcu cursus vitae congue mauris rhoncus
        aenean vel elit scelerisque. Gravida rutrum quisque non tellus. Maecenas
        accumsan lacus vel facilisis volutpat est velit. Cras pulvinar mattis
        nunc sed blandit libero volutpat sed cras. In fermentum posuere urna nec
        tincidunt. Vitae aliquet nec ullamcorper sit amet risus nullam eget
        felis.
      </Collpase>
    </div>
  );
}
