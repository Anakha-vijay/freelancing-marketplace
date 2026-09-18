import Navbar from "../components/Navbar";
import "../App.css";

function Home() {
  return (
    <div>

      <Navbar />

      <section className="hero">

        <h1>
          Find the right talent for your next project
        </h1>

        <p>
          Connect with skilled freelancers and find projects
          that match your skills and experience.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            Find Work
          </button>

          <button className="secondary-btn">
            Hire Talent
          </button>

        </div>

      </section>

    </div>
  );
}

export default Home;