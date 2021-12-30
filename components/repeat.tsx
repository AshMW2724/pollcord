import React, { ReactElement } from 'react';

interface Props {
  children: ReactElement;
  amount: number;
}

export default function Repeat({ children, amount }: Props): ReactElement {
  const repeat = new Array(amount).fill(0);
  return (
    <>
      {repeat.map((e, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </>
  );
}
