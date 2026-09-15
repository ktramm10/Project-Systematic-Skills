

export default function Lineage() {
return (
<main>
  <section className="content-section">
    <h1 className="content-heading">Lineage</h1>

    <p className="content-copy">My lineage is as follows:</p>

    <p className="content-copy">
      I am a student of Professor Aaron Martin and Steven Galvez.
    </p>

    <p className="content-copy">
      Aaron and Steven are 3rd and 1st degree black belts under Professor Marcelo Alonso.
    </p>

    <p className="content-copy">
      Professor Alonso is a 7th degree coral belt under Professor Carlson Gracie.
    </p>

    <p className="content-copy">
      Carlson Gracie is a 9th degree red and black belt under Professor Carlos Gracie Sr.
    </p>

    <p className="content-copy">
      Professor Carlos Gracie Sr. is a 10th degree red belt and one of the founders
      of Brazilian Jiu-Jitsu.
    </p>
  </section>

  <section className="content-section">
    <h2 className="content-heading">Lineage Map</h2>

    <div className="lineage-image-container">
      <img
        className="lineage-image"
        src="/content/images/skill-based-development-lineage-image.png"
        alt="Brazilian Jiu-Jitsu lineage map"
      />
    </div>
  </section>
</main>
);
}