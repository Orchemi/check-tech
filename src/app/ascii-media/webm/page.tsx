const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <video
        src="/video/ascii-canvas-1.webm"
        autoPlay
        loop
        muted
        style={{ maxWidth: '100%', maxHeight: '80vh' }}
      />
    </div>
  );
};

export default page;
