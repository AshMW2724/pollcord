declare module 'react-popout' {
  function Popout(props: {
    title: string;
    url?: string;
    onClosing?: () => void;
    onError?: () => void;
    options?: {
      left?: number | string;
      right?: number | string;
      top?: number | string;
      bottom?: number | string;
      height?: number | string;
      width?: number | string;
      menubar?: 'yes' | 'no';
      location?: 'yes' | 'no';
    };
    containerId?: string;
    children?: FC;
  });
  export default Popout;
}
