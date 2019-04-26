import React from 'react';

const Section = props =>
  <section>
    <p>{props.title}</p>
    {props.children}
  </section>;

export default Section;
