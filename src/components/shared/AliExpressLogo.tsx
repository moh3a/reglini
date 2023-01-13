/* eslint-disable @next/next/no-img-element */
interface AELogoProps {
  width: number;
}

const AliExpressLogo = ({ width }: AELogoProps) => {
  return <img src="/aliexpress-ar21.png" alt="aliexpress logo" width={width} />;
};

export default AliExpressLogo;
