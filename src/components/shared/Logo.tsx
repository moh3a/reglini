export const Logo = ({
  width,
  height,
}: {
  width?: string | number;
  height?: string | number;
}) => {
  return (
    <>
      <svg
        cursor="pointer"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 39 45"
      >
        <defs>
          <linearGradient
            id="L05010050004e000100100db0004100.grad"
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
          >
            <stop offset="0%" stopColor="#04e000" stopOpacity="1" />
            <stop offset="100%" stopColor="#db0004" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g transform="translate(0.5 6.1545)">
          <g>
            <g>
              <ellipse
                cx="5mm"
                cy="5mm"
                fill="#1b1f23"
                rx="5mm"
                ry="5mm"
                stroke="#000"
                strokeWidth="0"
              />
            </g>
            <g transform="translate(18.8976 14.1732)">
              <ellipse
                cx="1.9643mm"
                cy="1.875mm"
                fill="url(#L05010050004e000100100db0004100.grad)"
                rx="1.9643mm"
                ry="1.875mm"
                stroke="none"
                strokeWidth="0.07142857142857142"
              />
            </g>
            <g transform="translate(10.1237 10.1237)">
              <rect
                fill="none"
                height="3.9286mm"
                stroke="none"
                strokeWidth="0"
                width="3.0357mm"
                x="0mm"
                y="0mm"
              />
              <g transform="translate(-5.3993 -23.622)" className="Text.cls">
                <rect
                  x="0"
                  y="0"
                  width="11.4736"
                  height="14.8481"
                  fill="none"
                  stroke="none"
                />
                <text
                  fontFamily="Ubuntu, Arial, Helvetica, sans-serif"
                  fill="#e0e0e0"
                  fillOpacity="1"
                  fontSize="36px"
                  fontWeight={500}
                >
                  <tspan
                    x="-0.7368"
                    y="40.9041"
                    className="inline-block rtl:relative rtl:left-4"
                  >
                    r
                  </tspan>
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};
