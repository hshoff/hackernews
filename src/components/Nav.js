import React from 'react';
import cx from 'classnames';

const Nav = props => {
  const { value, onChange, options, refresh } = props;
  return (
    <nav className="Nav">
      <div className="Brand" onClick={refresh}>
        HackerNews
      </div>
      {options.map(option => {
        const classes = cx({
          'NavItem--selected': option === value,
        }, "NavItem");
        return (
          <div key={option}  className={classes} onClick={e => onChange(option)}>
          {option.replace('stories', '')}
          </div>
        );
      })}
      {props.children}
    </nav>
  );
}

export default Nav;