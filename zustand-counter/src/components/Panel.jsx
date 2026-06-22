import Display from "./Display";
import Controls from "./Controls";

const Panel = ({counter, setCounter}) => {
  return (
    <div>
      <Display />
      <Controls />
    </div>
  )
}