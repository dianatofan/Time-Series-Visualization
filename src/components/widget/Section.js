import React from 'react';

import './Section.scss';

const Section = props =>
  <section className={`section ${props.className || ''}`} onKeyDown={props.onKeyDown} tabIndex={props.tabIndex}>
    <p>{props.title}</p>
    {props.children}
  </section>;

export default Section;
