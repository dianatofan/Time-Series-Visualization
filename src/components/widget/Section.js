import React from 'react';

import './Section.scss';

const Section = props =>
  <section className={`section ${props.className || ''}`}>
    <p>{props.title}</p>
    {props.children}
  </section>;

export default Section;
