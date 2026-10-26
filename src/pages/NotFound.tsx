import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page-hero section-shell">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        This page
        <br />
        <em>isn't here.</em>
      </h1>
      <p>The link may have changed or the address may be mistyped.</p>
      <Link className="button button-dark" to="/">
        Return to home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
};

export default NotFound;
