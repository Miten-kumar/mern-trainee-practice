
const Hero = () => {
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="container hero-content">
        <div>
          <p className="eyebrow">
            Performance First
          </p>

          <h1 id="hero-title">
            Fast websites create better
            experiences.
          </h1>

          <p className="hero-description">
            This application demonstrates
            production-ready web performance
            optimization and Real User
            Monitoring.
          </p>
        </div>

        <img
          src="/images/hero-optimized.webp"
          alt="Performance optimization dashboard"
          width="800"
          height="500"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default Hero;