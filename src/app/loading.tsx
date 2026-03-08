

export default function loading() {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div
        className="inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};


      // <div className="w-full h-screen absolute -z-10">
      //   <PixelBlast
      //     variant="diamond"
      //     pixelSize={3}
      //     color="#7EACB5"
      //     patternScale={2}
      //     patternDensity={1}
      //     pixelSizeJitter={0}
      //     enableRipples
      //     rippleSpeed={0.2}
      //     rippleThickness={0.10}
      //     rippleIntensityScale={1.5}
      //     liquid={false}
      //     liquidStrength={0.12}
      //     liquidRadius={1.2}
      //     liquidWobbleSpeed={12}
      //     speed={0.5}
      //     edgeFade={0.01}
      //     transparent
      //   />
      // </div>