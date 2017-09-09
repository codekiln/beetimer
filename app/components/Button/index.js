/**
 *
 * AddButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

// import styled from 'styled-components';


function Button(props) {
  return (
    <button className="btn" onClick={props.onClick} >
      {props.children}
    </button >
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default Button;
