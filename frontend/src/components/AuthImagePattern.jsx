const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => {
            // All boxes visible with same base color
            // Alternate animation delay for stagger effect
            const animationStyle = {
              animationDelay: i % 2 === 0 ? "0ms" : "500ms",
            };

            return (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-primary animate-pulse"
                style={animationStyle}
              />
            );
          })}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
