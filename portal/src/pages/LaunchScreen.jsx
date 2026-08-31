import { SCHOOL } from '../config';

export default function LaunchScreen() {
  return (
    <div className="launch">
      <div className="launch-mark">{SCHOOL.code}</div>
      <div className="launch-bar"><span /></div>
    </div>
  );
}
